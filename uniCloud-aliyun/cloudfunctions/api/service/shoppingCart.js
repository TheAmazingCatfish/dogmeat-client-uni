const BaseService = require('./base');

module.exports = class CartService extends BaseService {
    constructor(ctx) {
        super(ctx, 'shopping-cart-items');
    }
    
    
    
    async getItemById(_id) {
        let { affectedDocs, data } = await this.collection.aggregate()
            .match({
                _id
            })
            .lookup({
                from: 'opendb-mall-goods',
                localField: 'product_id',
                foreignField: '_id',
                as: 'product'
            })
            .end();
        
        if (affectedDocs === 0) {
            return {
                affectedDocs,
                message: '物品不存在或已被移除'
            };
        }
        
        data = data[0];
        
        if (data.user_id != this.ctx.userId) {
            return { message: '非法操作' };
        }
        
        data.product = data.product[0];
            
        return { affectedDocs, data };
    }
    
    async increaseItemQuantity(_id, increment = 1) {
        const result = await this.getItemById(_id);
        
        if (!result.data) return result;
        
        const { product, quantity } = result.data;
        const newQuantity = quantity + increment;
        
        if (newQuantity < 1) {
            return { message: '再减就没了哦' };
        }
        
        if (newQuantity > product.stock) {
            return { message: '库存不足了' };
        }
        
        return this.collection.doc(_id).update({
            quantity: this.db.command.inc(increment)
        });
    }
}
