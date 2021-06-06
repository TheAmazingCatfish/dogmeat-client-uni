import request from "@/common/request";

export default {
    namespaced: true,
    state: () => ({
        items: null,
        itemCount: undefined
    }),
    getters: {
        totalPrice({ items, itemCount }) {
            return ;
        }
    },
    mutations: {
        ADD_ITEM(state, item) {
            state.items.unshift(item);
        },
        SET_ITEMS(state, items) {
            state.items = items;
        },
        SET_ITEM_COUNT(state, itemCount) {
            state.itemCount = itemCount
        }
    },
    actions: {
        async addProduct({ state, commit, dispatch }, { product, quantity = 1 }) {
            if (product.stock < quantity) {
                return uni.showToast({
                    title: '库存不足了~'
                });
            }
            
            const { items, itemCount } = state;
            
            // TODO: 若 items 长度小于 itemCount，说明购物车物品未全部获取到本地，应直接向云端查询商品是否已在购物车中
            // if (items.length < itemCount) {}
            
            const cartItem = items.find(item => item.product._id == product._id);
            
            try {
                if (!cartItem) {
                    const { id: _id } = await request('addProductToCart', {
                        product_id: product._id,
                        quantity
                    });
                        
                    if (_id) {
                        commit('ADD_ITEM', {
                            _id,
                            product,
                            quantity,
                            date_added: Date.now()
                        });
                        commit('SET_ITEM_COUNT', itemCount + 1);
                    }
                } else {
                    if (product.stock < quantity + cartItem.quantity) {
                        return uni.showToast({
                            title: '库存不足了~'
                        });
                    }
                    
                    const { updated } = await request('changeCartItemQuantity', {
                        _id: cartItem._id,
                        quantity: cartItem.quantity + quantity,
                        updateDate: true
                    });
                    
                    if (updated > 0) {
                        dispatch('getItems');
                    }
                }
                
                uni.showToast({
                    icon: 'success',
                    title: '添加成功~'
                });
            } catch (error) {
                console.error(error);
                uni.showToast({
                    icon: 'none',
                    title: '网络请求出错了~'
                });
            }
        },
        async getItems({ commit }) {
            try {
                const { data, count } = await request('getCartItems');
                
                const cartItems = count > 0 ?
                    data.map(({ _id, product_id, quantity, date_added }) => ({
                        _id,
                        product: product_id[0],
                        quantity,
                        date_added
                    })) :
                    [];
                
                commit('SET_ITEMS', cartItems);
                commit('SET_ITEM_COUNT', count);
            } catch (e) {
                console.error(e);
                uni.showToast({
                    icon: 'none',
                    title: '网络请求出错了~'
                });
            }
        }
    }
}