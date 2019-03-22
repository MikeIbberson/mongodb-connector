import { MongoClient } from 'mongodb';

export default class Connector {

    client = null;
    db = null;

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

    async getCollection(name, options) {
        return await this.db.createCollection(name, options);
    }
}
