import { MongoMemoryServer } from 'mongodb-memory-server';
import Connector from '../connector';

let host;
let dbName;
let instance;

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

beforeEach(() => {
    instance = new Connector();
});

describe('Connector class', () => {

    it('should instantiate with null properties', () =>
        expect(instance)
            .toHaveProperty('client', null));

    it('should return connection', async () =>
        expect(await instance.connect(host, dbName))
            .not.toBeNull());

    it('should throw an error without uri', () =>
        expect(instance.connect())
            .rejects
            .toThrowError());

    it('should throw an error without name', () =>
        expect(instance.connect(host))
            .rejects
            .toThrowError());

    it('should throw an error if disconnected is called before connect', () =>
        expect(instance.disconnect())
            .rejects
            .toThrowError());

    it('should disconnect from database', async () => {
        await instance.connect(host, dbName);
        expect(await instance.disconnect())
            .toBeUndefined();
    });

    it('should throw an error if collection called before connection', () =>
        expect(instance.getCollection('test'))
            .rejects
            .toThrowError());

    it('should return a collection', async () => {
        await instance.connect(host, dbName);
        expect(await instance.getCollection('test'))
            .toHaveProperty('stats');
    });

    it('should set validation options', async () => {
        await instance.connect(host, dbName);
        let col = await instance.getCollection('demo', {
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