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

// 地址集合
const addresses = db.collection('uni-id-address');

function addAddress(address) {
    address.user_id = $cloudEnv.uid;
    
    return addresses.add(address);
}

function getAddresses() {
    return addresses.where('user_id == $cloudEnv_uid').get();
}

function updateAddress(address) {
    const addressData = { ...address };
    
    // 剔除 _id 属性
    Reflect.deleteProperty(addressData, '_id');
    return addresses.doc(address._id).update(addressData);
}

function deleteAddress(id) {
    return addresses.doc(id).remove();
}

// 购物车物品集合
const shoppingCartItems = db.collection('shopping-cart-items');

function addProductToCart({ product_id, quantity = 1 }) {
    return shoppingCartItems.add({
        user_id: $cloudEnv.uid,
        product_id,
        quantity
    });
}

function getCartItems() {
    return db.collection('shopping-cart-items,opendb-mall-goods')
        .where('user_id == $cloudEnv_uid')
        .field('product_id{_id,name,price,special_tag,stock,thumbnail},quantity,date_added')
        .foreignKey('shopping-cart-items.product_id')
        .orderBy('date_added desc')
        .get({ getCount: true });
}

function changeCartItemQuantity({ _id, quantity, updateDate = false }) {
    const data = !updateDate ?
        { quantity } :
        {
            quantity,
            date_added: $cloudEnv.now
        };
    return shoppingCartItems
        .doc(_id)
        .update(data);
}

function removeProductFromCart() {}

const apis = {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    addProductToCart,
    getCartItems,
    changeCartItemQuantity,
    removeProductFromCart
};

export default apis;