import { MongoClient } from 'mongodb';

export default class Connector {

    client = null;
    db = null;

    async connect(args = {}) {
        try {

            let uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`;
            let options = Object.assign(args, {
                useNewUrlParser: true,
            });

            this.client = await MongoClient.connect(uri, options);
            this.db = this.client.db(process.env.DB_NAME);

            console.log('Connection to MongoDB established');
            return this.db;

        } catch (err) {
            console.log('Connection to MongoDB failed to establish');
            throw new Error(err);
        }
    }


    async disconnect() {
        return await this.client.disconnect();
    }

    async getCollection(name) {
        return this.db.collection(name);
    }

}