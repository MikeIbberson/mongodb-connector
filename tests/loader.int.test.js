import MongoMemoryServer from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { Loader } from '../src';

let db;
let conn;
let instance;
let client;

beforeAll(async () => {
    const server = new MongoMemoryServer();
    const name = await server.getDbName();

    conn = await server.getConnectionString();
    client = await MongoClient.connect(conn, {
        useNewUrlParser: true
    });

    db = await client.db(name);
    instance = new Loader(db.collection('demo'));

    await instance.col.insertMany([
        { name: 'Roy' },
        { name: 'Lee' },
        { name: 'Tara' }
    ]);
});

afterAll(async () => {
    await client.close();
});

describe('Read operations', () => {

    it('should should return no results', async () => {
        expect(await instance.find())
            .toHaveLength(3);
    });

});