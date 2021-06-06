<template>
    <view v-if="!loggedIn" class="cart--user-not-logged-in">
        <text>您还未登陆，先去登录吧~</text>
        <navigator open-type="navigateBack">
            <button class="to-login dogmeat">去登录</button>
        </navigator>
    </view>
    <view v-else-if="cartItemCount < 1" class="cart--empty">
        <text>购物车空空如也，先去逛逛吧~</text>
        <navigator url="/pages/user/login">
            <button class="to-login dogmeat">去逛逛</button>
        </navigator>
    </view>
    <view v-else class="list">
        <!-- 刷新页面后的顶部提示框 -->
        <!-- 当前弹出内容没有实际逻辑 ，可根据当前业务修改弹出提示 -->
        <view class="tips" :class="{ 'tips-ani': tipShow }">为您更新了购物车信息</view>
        <uni-list v-if="cartItems">
            <!-- to 属性携带参数跳转详情页面，当前只为参考 -->
            <uni-list-item
                class="uni-list-item--waterfall" title="自定义商品列表"
                v-for="cartItem of cartItems" :key="cartItem._id"
                :border="true"
                :to="`/pages/product/product?id=${cartItem.product._id}&title=${cartItem.product.name}`"
            >
                <!-- 通过header插槽定义列表左侧图片 -->
                <template #header>
                    <view class="d-flex align-center">
                        <checkbox :value="cartItem._id" @tap.stop />
                    </view>
                </template>
                <!-- 通过body插槽定义商品布局 -->
                <template #body>
                    <view class="d-flex">
                        <view class="uni-thumb product-image">
                            <image :src="cartItem.product.thumbnail" mode="aspectFill" />
                            
                            <overlay v-if="item.stock < 1" absolute>
                                <view class="tip-sold-out">
                                    <text>无货</text>
                                    <text>----- · -----</text>
                                    <text>Sold out</text>
                                </view>
                            </overlay>
                        </view>
                        
                        <view class="shop">
                            <view>
                                <view class="uni-title">
                                    <text class="ellipsis-2">{{ cartItem.product.name }}</text>
                                </view>
                                
                                <text class="uni-tag hot-tag">{{ cartItem.product.special_tag }}</text>
                            </view>
                            
                            <view class="d-flex justify-space-between">
                                <view class="product-price">
                                    <text>¥</text>
                                    <text class="product-price__int-part">{{ cartItem.product.price / 100 }}</text>
                                    <text>.{{ `${ cartItem.product.price % 100 }`.padStart(2, '0') }}</text>
                                </view>
                                
                                <uni-number-box
                                    :value="cartItem.quantity"
                                    :min="1"
                                    :max="cartItem.product.stock"
                                    @change="changeCartItemQuantity(cartItem._id, $event)"
                                    @tap.stop
                                />
                            </view>
                        </view>
                    </view>
                </template>
            </uni-list-item>
        </uni-list>
        
        <view v-if="cartItemCount > 0" class="bottom-nav floating-object">
            <label>
                <checkbox /><text>全选</text>
            </label>
            
            <button class="proceed-to-checkout dogmeat">去结算</button>
        </view>
    </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    components: {},
    data() {
        return {
            tipShow: false // 是否显示顶部提示框
        };
    },
    computed: {
        ...mapGetters('user', [
            'loggedIn'
        ]),
        ...mapState('cart', {
            cartItems: 'items',
            cartItemCount: 'itemCount'
        })
    },
    async onShow() {
        if (this.loggedIn && !this.cartItems) {
            uni.showLoading();
            await this.$store.dispatch('cart/getItems');
            uni.hideLoading();
        }
    },
    /**
     * 下拉刷新回调函数
     */
    async onPullDownRefresh() {
        this.tipShow = true;
        if (this.loggedIn) {
            await this.$store.dispatch('cart/getItems');
        }
        this.tipShow = false;
        uni.stopPullDownRefresh();
    },
    /**
     * 上拉加载回调函数
     */
    onReachBottom() {
        
    },
    methods: {
        changeCartItemQuantity(id, quantity) {
            console.log(quantity);
        }
    }
};
</script>

<style lang="scss">
page {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    min-height: 100%;
    height: auto;
}

.cart--user-not-logged-in,
.cart--empty {
    flex: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

button.to-login {
    margin: $uni-spacing-row-lg;
    width: 150px;
}

.tips {
    color: #67c23a;
    font-size: 14px;
    line-height: 40px;
    text-align: center;
    background-color: #f0f9eb;
    height: 0;
    opacity: 0;
    transform: translateY(-100%);
    transition: all 0.3s;
}

.tips-ani {
    transform: translateY(0);
    height: 40px;
    opacity: 1;
}

.shop {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.product-image {
    position: relative;
    width: 110px;
    height: 110px;
}

.tip-sold-out {
    $size: 100px;
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: $size;
    height: $size;
    border-radius: 50%;
    background-color: rgba($shrine-pink-900, .7);
    color: white;
}

.shop-picture-column {
    width: 100%;
    height: 170px;
    margin-bottom: 10px;
}

.product-price {
    margin-top: 5px;
    font-size: 12px;
    color: #ff5a5f;
}

.product-price__int-part {
    font-size: 16px;
}

.hot-tag {
    background: #ff5a5f;
    border: none;
    color: #fff;
}

.button-box {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    background: #007AFF;
    color: #fff;
}

.uni-link {
    flex-shrink: 0;
}

.ellipsis {
    display: flex;
    overflow: hidden;
}

.uni-ellipsis-1 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.ellipsis-2 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}


// 默认加入 scoped ，所以外面加一层提升权重
.list {
    .uni-list--waterfall {

        /* #ifndef H5 || APP-VUE */
        // 小程序 编译后会多一层标签，而其他平台没有，所以需要特殊处理一下
        /deep/ .uni-list {
        /* #endif */
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            padding: 5px;
            box-sizing: border-box;

            /* #ifdef H5 || APP-VUE */
            // h5 和 app-vue 使用深度选择器，因为默认使用了 scoped ，所以样式会无法穿透
            /deep/
            /* #endif */
            .uni-list-item--waterfall {
                width: 50%;
                box-sizing: border-box;

                .uni-list-item__container {
                    padding: 5px;
                    flex-direction: column;
                }
            }

        /* #ifndef H5 || APP-VUE */
        }
        /* #endif */
    }
}

.bottom-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    padding: $uni-spacing-col-lg $uni-spacing-row-lg;
    width: 100%;
    background-color: $shrine-pink-50;
}

button.proceed-to-checkout {
    margin: 0;
    width: calc(375rpx - #{$uni-spacing-row-lg} * 2);
}
</style>
