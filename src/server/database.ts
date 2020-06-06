import { MongoClient, Db } from 'mongodb';
import assert from 'assert';

import generateDslId from './utils/generate-dsl-id';

import { Dsl } from '../shared/types';

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
export async function getDsl(id: number) {
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
    lastTrigger: Date.now()
  } as Dsl);

  return id;
}
