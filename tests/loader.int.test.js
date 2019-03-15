import MongoMemoryServer from 'mongodb-memory-server';
import { MongoClient, ObjectId } from 'mongodb';
import { Loader } from '../src';

let db;
let conn;
let instance;
let client;
let col;

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
    col = db.collection('demo');

    await col.insertMany([
        { _id: ObjectId(), name: 'Lee' },
        { _id: ObjectId(), name: 'Tara' },
        ref
    ]);
});

beforeEach(() => {
    instance = new Loader(col);
})

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

describe('write operations', () => {

    it('should insert single doc', async () =>
        expect(await instance.createOne({ name: 'George' }))
            .toHaveProperty('_id'));

    it('should throw an error if the document was not inserted', () => {
        instance.col.insertOne = jest.fn(() =>
            new Promise(resolve => resolve({
                insertedCount: 0
            })));

        expect(instance.createOne({}))
            .rejects
            .toThrowError();
    });

    it('should throw an error if ID not provided', () =>
        expect(instance.updateById())
            .rejects
            .toThrowError());

    it('should throw an error if update ID not found', () =>
        expect(instance.updateById(ObjectId()))
            .rejects
            .toThrowError());

    it('should return updated document', async () => {
        instance.batchById.clear = jest.fn();

        expect(await instance.updateById(ref._id, {
            $set: { name: 'Kelly' }
        })).toMatchObject({
            _id: ref._id,
            name: 'Kelly'
        });

        expect(instance.batchById.clear)
            .toHaveBeenCalledWith(ref._id);
    });

});