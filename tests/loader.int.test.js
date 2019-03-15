import MongoMemoryServer from 'mongodb-memory-server';
import { MongoClient, ObjectId } from 'mongodb';
import { Loader } from '../src';

let db;
let conn;
let instance;
let client;

let ref = {
    _id: ObjectId(),
    name: 'Roy'
};

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
        { _id: ObjectId(), name: 'Lee' },
        { _id: ObjectId(), name: 'Tara' },
        ref
    ]);
});

afterAll(async () => {
    await client.close();
});

describe('Read operations', () => {

    it('should should return all results', async () => {
        expect(await instance.find())
            .toHaveLength(3);
    });

    it('should return filtered results', async () => {
        expect(await instance.find({ name: 'Roy' }))
            .toHaveLength(1);
    });

    it('should return single document', async () => {
        expect(await instance.findOne({ _id: ref._id }))
            .toMatchObject(ref);
    });

    it('should return null', async () => {
        expect(await instance.findOne({ _id: ObjectId() }))
            .toBeNull();
    });

});