import { Connector } from '../src';
import { arrayIntoJSONSchema } from '../src/connector';

let host;
let instance;

const initValidator = {
    bsonType: 'object',
    required: [],
    properties: []
};

beforeAll(() => {
    host = process.env.DB_HOST;
});

beforeEach(() => {
    instance = new Connector();
});

describe('Connector class', () => {

    it('should instantiate with null properties', () =>
        expect(instance)
            .toHaveProperty('client', null));

    it('should return connection', async () =>
        expect(await instance.connect())
            .not.toBeNull());

    it('should throw an error without environment variables', () => {
        process.env.DB_HOST = null;
        expect(instance.connect())
            .rejects
            .toThrowError()
    });

    it('should throw an error if disconnected is called before connect', () =>
        expect(instance.disconnect())
            .rejects
            .toThrowError());

    it('should disconnect from database', async () => {
        process.env.DB_HOST = host;
        await instance.connect();
        expect(await instance.disconnect())
            .toBeUndefined();
    });

    it('should throw an error if collection called before connection', () =>
        expect(() => instance.getCollection('test'))
            .toThrowError());

    it('should return a collection', async () => {
        await instance.connect();
        expect(instance.getCollection('test'))
            .toHaveProperty('stats');
    });

    it('should set validation options', async () => {
        let db = await instance.connect();
        await instance.validateCollection('demo', {
            fieldName: {
                type: 'string',
                description: 'Set this',
                required: true
            }
        });

        let col = instance.getCollection('demo');
        console.log(col);
        expect(col.options).toHaveProperty('validator');

    })

});

describe('iterator helper for schema validation', () => {

    it('should fail to reduce without a type', () =>
        expect(() => arrayIntoJSONSchema(initValidator, ['field', {}]))
            .toThrowError());

    it('should populate the required fields array', () => {
        let reducer = arrayIntoJSONSchema(
            initValidator,
            ['field', { type: 'String', required: true }]
        );

        expect(reducer)
            .toHaveProperty('required', ['field']);
    });

    it('should format the key-value pair', () => {
        let reducer = arrayIntoJSONSchema(
            initValidator,
            ['field', { type: 'String', description: 'Hi' }]
        );

        expect(reducer.properties.field)
            .toMatchObject({
                bsonType: 'String',
                description: 'Hi'
            });
    });

});