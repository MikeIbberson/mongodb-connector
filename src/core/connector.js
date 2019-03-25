import { MongoClient } from 'mongodb';

let client = null;
let db = null;


/**
 * Wraps MongoClient. 
 * Simply, provide a connection string.
 * 
 * @param {string} uri 
 * @param {string} name 
 * @param {object} args 
 * @return {object}
 */

export const connect = async (uri, name, args = {}) => {
    if (!uri) throw new Error('Connection string required');
    if (!name) throw new Error('Database name required');

    let options = Object.assign(args, {
        useNewUrlParser: true,
    });

    try {
        client = await MongoClient.connect(uri, options);
        db = client.db(name);
        return db;

    } catch (err) {
        throw new Error(err);
    }
}


/**
 * 
 * Uses the "createCollection" method so that users can provide 
 * database configurations like validation and collation in the options.
 * 
 * @param {string} name 
 * @param {object} options
 * @return {object} 
 */

export const getCollection = async (name, options) =>
    await db.createCollection(name, options);

export const disconnect = async () =>
    await client.close();