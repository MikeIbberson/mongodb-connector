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
            this.db = this.client.db(process.env.DB_NAME);
            return this.db;

        } catch (err) {
            throw new Error(err);
        }
    }


    async disconnect() {
        return await this.client.close();
    }

    getCollection(name) {
        return this.db.collection(name);
    }

    async validateCollection(name, props) {
        let validator = {
            $jsonSchema: Object
                .entries(props)
                .reduce(arrayIntoJSONSchema, {
                    bsonType: 'object',
                    required: [],
                    properties: {}
                })
        };

        let exists = await this.db.listCollections({ name });

        if (!validator.$jsonSchema.required.length) {
            delete validator.$jsonSchema.required;
        }

        return exists.length ?
            this.db.command({
                collMod: name,
                validationLevel: 'moderate',
                validationAction: 'warn',
                validator
            }) :
            this.db.createCollection(name, {
                validator
            });

    }

}

export const arrayIntoJSONSchema = (acc, [key, value]) => {
    if (!value.type) {
        throw new Error('Type is a required property');
    }

    if (value.required) {
        acc.required.push(key);
    }

    acc.properties[key] = {
        bsonType: value.type,
        description: value.description
    };

    return acc;
};