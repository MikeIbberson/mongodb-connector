import { MongoClient } from 'mongodb';

export default class Connector {

    client = null;
    db = null;


    /**
     * Wraps MongoClient. 
     * Simply, provide a connection string.
     * 
     * @param {string} uri 
     * @param {string} name 
     * @param {object} args 
     * @return {object}
     */

    async connect(uri, name, args = {}) {
        if (!uri) throw new Error('Connection string required');
        if (!name) throw new Error('Database name required');

        let options = Object.assign(args, {
            useNewUrlParser: true,
        });

        try {
            this.client = await MongoClient.connect(uri, options);
            this.db = this.client.db(name);
            return this.db;

        } catch (err) {
            throw new Error(err);
        }
    }

    async disconnect() {
        return await this.client.close();
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

    async getCollection(name, options) {
        return await this.db.createCollection(name, options);
    }
}
