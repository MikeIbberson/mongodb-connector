import DataLoader from 'dataloader';
import assert from 'assert';

export default class LoaderWrapper {

    constructor(col) {
        if (!col.stats || typeof col.stats !== 'function') {
            throw new Error('Must provide a collection');
        }

        this.col = col;

    }

    batchById = new DataLoader(async ids =>
        await this.find({
            _id: { $in: ids }
        }));

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
        return ops;
    };


}