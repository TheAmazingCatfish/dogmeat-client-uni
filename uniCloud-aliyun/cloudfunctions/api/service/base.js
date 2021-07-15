const { Service } = require('uni-cloud-router');

module.exports = class BaseService extends Service {
    constructor(ctx, collectionName) {
        super(ctx);
        
        this.collection = collectionName ? uniCloud.database().collection(collectionName) : undefined;
    }
}