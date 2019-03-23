import { ObjectId } from 'mongodb';
import { decodeCursor } from './encoding';

export const generateCursorQuery = (cursor, params) => {
    if (!cursor) return {};

    let query = {};
    let doc = decodeCursor(cursor);
    if (!params) return generateIDExpression(doc._id);

    for (let item in params) {
        query[item] = {
            [translateSortingArgument(params[item])]: doc[item]
        };
    }

    return query;
}

export const generateIDExpression = id => ({
    _id: { $gte: ObjectId(id) }
});

export const translateSortingArgument = value => {
    if (isNaN(value)) {
        throw new TypeError('Does not support $meta');
    }

    return value > 0 ? '$gte' : '$lte';
};