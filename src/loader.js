import DataLoader from 'dataloader';
import { ObjectId } from 'mongodb';
import assert from 'assert';
import sift from 'sift';

export default class LoaderWrapper {
    constructor(col) {
        if (!col.stats || typeof col.stats !== 'function') {
            throw new Error('Must provide a collection');
        }

        this.col = col;

    }

    batchById = new DataLoader(async keys => {
        let resp = await this.find({
            _id: { $in: keys }
        });

        return keys.map(query =>
            resp.filter(
                sift({ _id: query })
            )[0] || null
        );
    });

    find = async args =>
        await this.col
            .find(args)
            .toArray();

    findOne = async args =>
        await this.col
            .findOne(args);

    createOne = async args => {
        let { ops, insertedCount } = await this.col
            .insertOne(args);

        assert.ok(insertedCount);
        assert.ok(ops.length);
        return ops[0];
    };

    updateById = async (id, args) => {
        if (!id) throw new Error('ID required');

        let { ok, value } = await this.col
            .findOneAndUpdate(
                { _id: ObjectId(id) }, args,
                { returnOriginal: false }
            );

        assert.ok(ok);
        this.batchById.clear(id);
        return value;

    };

}