import { ObjectId } from 'mongodb';
import { decodeCursor } from './encoding';

export const generateCursorQuery = (cursor, params, reverse) => {
    if (!cursor) return {};

    let query = {};
    let doc = decodeCursor(cursor);
    if (!params) return generateIDExpression(doc._id);

    for (let item in params) {
        query[item] = {
            [translateSortingArgument(params[item], reverse)]: doc[item]
        };
    }

    return query;
}

export const generateIDExpression = id => ({
    _id: { $gte: ObjectId(id) }
});

export const translateSortingArgument = (value, inverse) => {
    if (isNaN(value)) {
        throw new TypeError('Does not support $meta');
    }

    let op = inverse ? value < 0 : value > 0;
    return op ? '$gte' : '$lte';
};