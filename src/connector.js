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

    validateCollection(name, props) {
        let validator = {
            $jsonSchema: Object
                .entries(props)
                .reduce(arrayIntoJSONSchema, {
                    bsonType: 'object',
                    required: [],
                    properties: []
                })
        };

        let colls = this.db.getCollectionNames();

        return colls.includes(name) ?
            this.db.runCommand({
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

export const arrayIntoJSONSchema = (acc, current) => {
    let key = current[0];
    let value = current[1];

    if (value.required) {
        acc.required.push(key);
    }

    acc.properties[key] = {
        bsonType: value.type,
        description: value.description
    };

    return acc;
};