import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, disconnect, getCollection } from '../connector';

let host;
let dbName;

const initValidator = {
    bsonType: 'object',
    required: [],
    properties: []
};

beforeAll(async () => {
    const mongod = new MongoMemoryServer({
        autoStart: false,
    });

    if (!mongod.isRunning) await mongod.start();
    host = await mongod.getConnectionString();
    dbName = await mongod.getDbName();
});

describe('Connector class', () => {

    it('should throw an error if disconnected is called before connect', () =>
        expect(disconnect())
            .rejects
            .toThrowError());

    it('should return connection', async () =>
        expect(await connect(host, dbName))
            .not.toBeNull());

    it('should throw an error without uri', () =>
        expect(connect())
            .rejects
            .toThrowError());

    it('should throw an error without name', () =>
        expect(connect(host))
            .rejects
            .toThrowError());

    it('should disconnect from database', async () => {
        await connect(host, dbName);
        expect(await disconnect())
            .toBeUndefined();
    });

    it('should throw an error if collection called before connection', () =>
        expect(getCollection('test'))
            .rejects
            .toThrowError());

    it('should return a collection', async () => {
        await connect(host, dbName);
        expect(await getCollection('test'))
            .toHaveProperty('stats');
    });

    it('should set validation options', async () => {
        await connect(host, dbName);
        let col = await getCollection('demo', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    properties: {
                        name: {
                            bsonType: 'string'
                        }
                    }
                }
            },
            collation: {
                locale: 'en'
            }
        });

        let options = await col.options();
        expect(options).toHaveProperty('validator');
        expect(options).toHaveProperty('collation');
        expect(options.validator).toHaveProperty('$jsonSchema');
        expect(options.collation).toHaveProperty('locale', 'en');
    });

});