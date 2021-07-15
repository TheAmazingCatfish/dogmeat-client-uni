const { Controller } = require('uni-cloud-router');

module.exports = class CartController extends Controller {
    async getItemById(ctx) {
        _id = ctx.data._id;
        
        if (_id === undefined) {
            return { message: '参数缺失：_id' };
        }
        
        return this.service.shoppingCart.getItemById(_id);
    }
    
    async increaseItemQuantity(ctx) {
        const { _id, increment } = ctx.data;
        
        if (_id === undefined) {
            return { message: '参数缺失：_id' };
        }
        
        return this.service.shoppingCart.increaseItemQuantity(_id, increment);
    }
}