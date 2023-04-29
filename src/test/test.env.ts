import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection } from 'mongoose';

let mongodMemory: MongoMemoryServer;
let mongoConnectionMemory: Connection;

beforeAll(async () => {
  mongodMemory = await MongoMemoryServer.create();
  const uri = mongodMemory.getUri();
  mongoConnectionMemory = (await connect(uri)).connection;
});

afterAll(async () => {
  await mongoConnectionMemory.dropDatabase();
  await mongoConnectionMemory.close();
  await mongodMemory.stop();
});

afterEach(async () => {
  const collections = mongoConnectionMemory.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

export { mongoConnectionMemory };
