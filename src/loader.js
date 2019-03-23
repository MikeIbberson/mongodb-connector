import DataLoader from 'dataloader';
import { ObjectId } from 'mongodb';
import assert from 'assert';
import sift from 'sift';
import { appendPagination } from '../src/helpers/response';
import { generateCursorQuery } from '../src/helpers/query';

export default class LoaderWrapper {
    constructor(col, options = {}) {
        if (!col.stats || typeof col.stats !== 'function') {
            throw new Error('Must provide a collection');
        }

        this.col = col;
        this.pagination = 25;
        Object.assign(this, options);
    }


    /**
     * 
     * Basic dataloader instance. 
     * Transforms all ids into ObjectIds and uses sift
     * to appropriately match the results.
     * 
     * @method load
     * @param {array} keys 
     * @return {object} 
     */

    batchById = new DataLoader(async keys => {
        let ids = keys.map(item => ObjectId(item));
        let resp = await this.find({
            _id: { $in: ids }
        });

        return keys.map(query =>
            resp.filter(
                sift({ _id: query })
            )[0] || null
        );
    });


    /**
     * 
     * Uses an ID to track last result, then searches for results greater/less than. 
     * Will replace with custom sorting if provided. 
     * 
     * @param {Array} params 
     * @return {Object}
     */

    find = async params => {
        let args = {};
        let sort = {};

        if (params) {

            let { orderBy, cursor, reverse, ...rest } = params;
            let orderByStatement = generateCursorQuery(cursor, orderBy, reverse);

            sort = orderBy;
            args = rest ?
                { $and: [rest, orderByStatement] } :
                orderByStatement;

        }

        return await appendPagination(
            this.col.find(args).sort(sort),
            this.pagination
        );
    };


    /**
     * @TODO: 
     * Implement new cache so we can store non-id lookups.
     */

    findOne = async args =>
        await this.col.findOne(args);

    findById = async (id, options = {}) =>
        await this.col.findOne({
            _id: ObjectId(id),
            ...options
        });

    aggregate = async args =>
        await appendPagination(
            this.col.aggregate(args),
            this.pagination
        );

    createOne = async args => {
        let { ops, insertedCount } = await this.col
            .insertOne(args);

        assert.ok(insertedCount);
        assert.ok(ops.length);

        let doc = ops[0];
        this.batchById.prime(doc._id, doc);
        return doc;
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

    deleteById = async (id, toggle) => {
        if (toggle) {
            await this.updateById(id, {
                $set: { [toggle]: false }
            });

            return true;
        } else {

            let { ok } = await this.col
                .deleteOne({
                    _id: ObjectId(id)
                });

            assert.ok(ok);
            this.batchById.clear(id);
            return true;
        }
    };

};