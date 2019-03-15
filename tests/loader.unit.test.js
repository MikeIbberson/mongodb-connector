import { ObjectId } from 'mongodb';
import { Loader } from '../src';

let args = { stats: jest.fn };
let instance;

beforeEach(() => {
    instance = new Loader(args);
});

describe('Loader instantiation', () => {

    it('should throw an error without a parameter', () =>
        expect(() => new Loader())
            .toThrowError());

    it('should throw an error with a non-function parameter', () =>
        expect(() => new Loader({ stats: true }))
            .toThrowError());

    it('should return methods if given a collection', () =>
        expect(instance)
            .toHaveProperty('col', args));

});

describe('Single ID batch method', () => {

    it('should aggregate the IDs', async () => {
        instance.find = jest.fn(() =>
            new Promise(resolve => resolve([1, 2, 3])));

        await Promise.all([
            instance.batchById.load(1),
            instance.batchById.load(2),
            instance.batchById.load(3)
        ]);

        expect(instance.find.mock.calls.length)
            .toBe(1);
    });

    it('should remove duplicates from the resolver array', async () => {
        instance.find = jest.fn(() =>
            new Promise(resolve => resolve([1])));

        await Promise.all([
            instance.batchById.load(1),
            instance.batchById.load(1)
        ]);

        expect(instance.find)
            .toHaveBeenCalledWith({
                _id: { $in: [1] }
            });
    });

    it('should ensure keys and values always have the same length', async () => {
        let match = { _id: ObjectId(), name: 'Logan' };
        let match2 = { _id: ObjectId(), name: 'Paul' };
        instance.find = jest.fn(() =>
            new Promise(resolve => resolve([match, match2])));

        let results = await Promise.all([
            instance.batchById.load(match._id),
            instance.batchById.load(ObjectId()),
            instance.batchById.load(match2._id)
        ]);

        expect(results[0]).toMatchObject(match);
        expect(results[2]).toMatchObject(match2);
        expect(results[1]).toBeNull();
    });

});