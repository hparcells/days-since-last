import { MongoClient, Db } from 'mongodb';
import assert from 'assert';

import generateDslId from './utils/generate-dsl-id';

import { Dsl, LoginInfo, Profile } from '../shared/types';

export let database: Db;

export function setupDatabase() {
  const client = new MongoClient(
    `mongodb+srv://hparcells:${process.env.DATABASE_PASSWORD}@dayssincelastcluster-aroxe.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );

  client.connect((error) => {
    assert.equal(null, error);

    database = client.db('daysSinceLastDatabase');
  });
}
export async function idExists(id: number) {
  return (await database.collection('dsls').find({ id }).count()) === 1;
}
export async function getDsl(id: number): Promise<Dsl> {
  return (await database.collection('dsls').find({ id }).toArray())[0];
}
export async function addDsl(name: string, createdBy: string) {
  const id = await generateDslId();

  await database.collection('dsls').insertOne({
    id,
    name,
    createdBy,
    createdOn: Date.now(),
    triggers: 0,
    lastTrigger: Date.now(),
    visibility: 'PUBLIC'
  } as Dsl);

  return id;
}
export async function resetDsl(id: number) {
  return await database
    .collection('dsls')
    .updateOne({ id }, { $inc: { triggers: 1 }, $set: { lastTrigger: Date.now() } });
}
export async function deleteDsl(id: number) {
  await database.collection('dsls').deleteOne({ id });
}
export async function toggleDslVisibility(id: number) {
  const dsl = await getDsl(id);
  const newVisibility = dsl.visibility === 'PUBLIC' ? 'UNLISTED' : 'PUBLIC';

  await database.collection('dsls').updateOne(
    { id },
    {
      $set: { visibility: newVisibility }
    }
  );
}
export async function profileExists(id: string) {
  return (await database.collection('profiles').find({ id }).count()) === 1;
}
export async function createProfile(profile: LoginInfo) {
  await database.collection('profiles').insertOne({
    id: profile.userId,
    name: profile.name,
    profilePicture: profile.profilePicture
  } as Profile);
}
export async function getProfile(userId: string) {
  return (
    await database.collection('profiles').find({ id: userId }).project({ _id: false }).toArray()
  )[0];
}
export async function getProfileDsls(userId: string) {
  return await database
    .collection('dsls')
    .find({ createdBy: userId })
    .project({ _id: false, id: true, name: true, visibility: true })
    .toArray();
}
export async function getRecentDsls(count: number = 10) {
  return await database
    .collection('dsls')
    .aggregate([
      {
        $sort: {
          createdOn: -1
        }
      },
      {
        $match: { visibility: 'PUBLIC' }
      },
      {
        $limit: count
      }
    ])
    .project({ _id: false, id: true, name: true })
    .toArray();
}
