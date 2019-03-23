import { encodeCursor } from './encoding';

export const appendPagination = async (service, num) => {
    let results = await service
        .limit(num + 1)
        .toArray();

    let cursor;
    let hasPrevious = false;
    let hasNext = results.length > num;

    if (hasNext) cursor = encodeCursor(results.pop());
    if (cursor) hasPrevious = true;

    return {
        hasPrevious,
        hasNext,
        cursor,
        results
    };
};