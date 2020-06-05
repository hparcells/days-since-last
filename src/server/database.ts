import { MongoClient, Db } from 'mongodb';
import assert from 'assert';

export let database: Db;

export function setupDatabase() {
  const client = new MongoClient(
    `mongodb+srv://hparcells:${process.env.DATABASE_PASSWORD}@dayssincelastcluster-aroxe.mongodb.net/daysSinceLastDatabase?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );

  client.connect((error) => {
    assert.equal(null, error);

    database = client.db('daysSinceLastDatabase');
  });
}
