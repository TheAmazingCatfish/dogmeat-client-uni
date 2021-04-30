const db = uniCloud.database();

// 云端环境变量
const $cloudEnv = {
    uid: db.getCloudEnv('$cloudEnv_uid'),
    now: db.getCloudEnv('$cloudEnv_now'),
    clientIP: db.getCloudEnv('$cloudEnv_clientIP')
}

// 透传 uni-id 自动刷新的 token 给客户端
db.on('refreshToken', function ({ token, tokenExpired }) {
    uni.setStorageSync('uni_id_token', token);
    uni.setStorageSync('uni_id_token_expired', tokenExpired);
})

// 购物车物品集合
const shoppingCartItems = db.collection('shopping-cart-items');

function addProductToCart({ productId, quantity = 1 }) {
    return shoppingCartItems.add({
        user_id: $cloudEnv.uid,
        product_id: productId,
        quantity
    });
}

function getCartItems() {
    return db.collection('shopping-cart-items,opendb-mall-goods')
        .where('user_id == $cloudEnv_uid')
        .field('product_id{_id,name,price,stock,thumbnail},quantity,date_added')
        .foreignKey('shopping-cart-items.product_id')
        .orderBy('date_added desc')
        .get({ getCount: true });
}

function changeCartItemQuantity({ id, quantity, updateDate = false }) {
    const data = !updateDate ?
        { quantity } :
        {
            quantity,
            date_added: $cloudEnv.now
        };
    return shoppingCartItems
        .doc(cartItem._id)
        .update(data);
}

function removeProductFromCart() {}

const apis = {
    addProductToCart,
    getCartItems,
    changeCartItemQuantity,
    removeProductFromCart
};

export default apis;