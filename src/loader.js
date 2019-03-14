import DataLoader from 'dataloader';
import { ObjectId } from 'mongodb';

export default class LoaderWrapper {

    constructor(col) {
        if (!col.stats && typeof col.stats === 'function') {
            throw new Error('Must provide a collection');
        }

        this.col = col;

    }

    find = async () =>
        await this.col
            .find()
            .toArray();

    findOne = async args =>
        await this.col
            .findOne(args);

    batchById = new DataLoader(async ids =>
        await ids.map(id => this.findOne({
            _id: ObjectId(id)
        }))
    );

}