export const encodeCursor = cursor => {
    let json = JSON.stringify(cursor);
    let encoded = Buffer.from(json);
    return encoded.toString('base64');
};

export const decodeCursor = cursor => {
    let buff = Buffer.from(cursor, 'base64');
    let decoded = buff.toString('ascii');
    return JSON.parse(decoded);
};