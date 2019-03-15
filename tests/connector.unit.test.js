import { Connector } from '../src';

let host;
let instance;

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

});