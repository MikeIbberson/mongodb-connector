import { ObjectId } from 'mongodb';
import { generateCursorQuery, generateIDExpression, translateSortingArgument } from '../src/helpers/query';
import { encodeCursor } from '../src/helpers/encoding';

describe('query builder', () => {

    it('should return empty object without a cursor', () =>
        expect(generateCursorQuery())
            .toMatchObject({}));

    it('should return "generateIDExpression"', () => {
        let id = { _id: ObjectId() };
        let encoded = encodeCursor(id);

        expect(generateCursorQuery(encoded)).toMatchObject({
            _id: { $gte: id._id }
        });
    });

    it('should return "generateIDExpression"', () => {
        let id = { name: 'hello' };
        let encoded = encodeCursor(id);

        expect(generateCursorQuery(encoded, { name: 1 })).toMatchObject({
            name: { $gte: id.name }
        });
    });

});

it('should return greater than query', () => {
    let id = ObjectId();
    let obj = generateIDExpression(id);

    expect(obj).toMatchObject({
        _id: { $gte: id }
    });
});

describe('convert sorting argument into query operation', () => {
    it('should return $gte', () =>
        expect(translateSortingArgument(1)).toMatch('$gte'));

    it('should return $gte', () =>
        expect(translateSortingArgument(1)).toMatch('$gte'));

    it('should throw an error', () =>
        expect(() => translateSortingArgument({})).toThrow(TypeError));
});
