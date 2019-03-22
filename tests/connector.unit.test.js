import { Connector } from '../src';
import { arrayIntoJSONSchema } from '../src/connector';
import { MongoMemoryServer } from 'mongodb-memory-server';

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
        expect(() => instance.getCollection('test'))
            .toThrowError());

    it('should return a collection', async () => {
        await instance.connect(host, dbName);
        expect(instance.getCollection('test'))
            .toHaveProperty('stats');
    });

    it('should set validation options', async () => {
        await instance.connect(host, dbName);
        await instance.validateCollection('demo', {
            fieldName: {
                type: 'string',
                description: 'Set this',
                required: true
            }
        });

        let col = instance.getCollection('demo');
        let options = await col.options();
        expect(options).toHaveProperty('validator');
        expect(options.validator).toHaveProperty('$jsonSchema');
    });

});

describe('iterator helper for schema validation', () => {

    it('should fail to reduce without a type', () =>
        expect(() => arrayIntoJSONSchema(initValidator, ['field', {}]))
            .toThrowError());

    it('should populate the required fields array', () => {
        let reducer = arrayIntoJSONSchema(
            initValidator,
            ['field', { type: 'string', required: true }]
        );

        expect(reducer)
            .toHaveProperty('required', ['field']);
    });

    it('should format the key-value pair', () => {
        let reducer = arrayIntoJSONSchema(
            initValidator,
            ['field', { type: 'string', description: 'Hi' }]
        );

        expect(reducer.properties.field)
            .toMatchObject({
                bsonType: 'string',
                description: 'Hi'
            });
    });

});