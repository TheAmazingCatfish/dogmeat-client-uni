<template>
    <view>
        <navigator class="close-button" open-type="navigateBack" :style="{ top: `${statusBarHeight + 8}px` }">
            <uni-icons type="closeempty" size="24" />
        </navigator>
        
        <unicloud-db
            ref="udbProducts"
            v-slot:default="{ data, loading, error, options }"
            collection="opendb-mall-goods"
            field="description,keywords,name,pictures,price,special_tag,stock,thumbnail"
            getone
            manual
            :where="query"
        >
            <view v-if="error">{{ error.message }}</view>
            <template v-else>
                <swiper class="product-pictures" indicator-dots>
                    <template v-if="data.pictures">
                        <swiper-item
                            v-for="(picture, index) in data.pictures" :key="index"
                            @tap="previewImage({ current: index, urls: data.pictures })"
                        >
                            <image class="product-picture" :src="picture" mode="aspectFill" />
                        </swiper-item>
                    </template>
                    <swiper-item v-else class="d-flex justify-center align-center">
                        <text class="uni-title">暂无图片</text>
                    </swiper-item>
                </swiper>
                
                <view class="price-banner">
                    <view class="special-tag">{{ data.special_tag }}</view>
                    <text class="product-price">￥{{ data.price || 0 }}</text>
                </view>
                
                <view class="product-title">{{ data.name }}</view>
                
                <button class="add-to-cart dogmeat" :disabled="data.stock <= 0" @tap="addProductToCart(data)">
                    <uni-icons class="icon" type="plus-filled" size="20" />
                    <text>{{ data.stock > 0 ? '加入购物车' : '已售罄' }}</text>
                </button>
                
                <rich-text :nodes="data.description" />
            </template>
        </unicloud-db>
        
        <navigator class="shopping-cart" url="../Cart/Cart">
            <uni-icons class="icon" type="cart-filled" size="24" />
            <image
                v-for="cartItem in twoCartItemsMostRecentlyAdded" :key="cartItem._id"
                :src="cartItem.product.thumbnail"
                mode="aspectFill"
            />
            <text v-if="cartItemCount - 2 > 0">{{ `+${cartItemCount - 2}` }}</text>
        </navigator>
    </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    data() {
        return {
            productId: ''
        };
    },
    computed: {
        query() {
            return `_id == '${this.productId}'`;
        },
        statusBarHeight() {
            return uni.getSystemInfoSync().statusBarHeight;
        },
        ...mapState('user', [
            'loggedIn'
        ]),
        ...mapState('cart', {
            cartItems: 'items',
            cartItemCount: 'itemCount'
        }),
        twoCartItemsMostRecentlyAdded() {
            return this.cartItems ? this.cartItems.slice(0, 2) : [];
        }
    },
    onLoad(option) {
        const productId = option.id;
        if (productId) {
            this.productId = productId;
        } else {
            uni.showToast({
                title: '页面参数错误'
            });
        }
    },
    onShow() {
        if (this.loggedIn && !this.cartItems) {
            this.$store.dispatch('cart/getItems');
        }
    },
    onReady() {
        if (this.productId) {
            this.$refs.udbProducts.loadData();
        }
    },
    methods: {
        previewImage: uni.previewImage,
        addProductToCart(product, quantity = 1) {
            this.$store.dispatch('cart/addProduct', { product, quantity });
        }
    }
}
</script>

<style lang="scss">
.close-button {
    position: fixed;
    left: $uni-spacing-row-lg;
    // top: var(--status-bar-height);
    z-index: 10;
}

.product-pictures {
    height: 750rpx;
}

.product-picture {
    width: 100%;
    height: 100%;
}

.price-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $uni-spacing-row-lg;
}

.special-tag {
    border-radius: 2px;
    padding: 1px 5px;
    background-color: $shrine-pink-50;
    text-align: center;
    color: $shrine-pink-900;
    font-size: 14px;
}

.product-price {
    color: $shrine-pink-900;
    font-size: 20px;
}

.product-title {
    padding: $uni-spacing-row-lg;
    color: $shrine-pink-900;
    // font-size: 20px;
    font-weight: 600;
}

button.add-to-cart {
    margin: $uni-spacing-row-lg;
    
    >.icon {
        margin-right: 5px;
    }
}

.description-image {
    max-width: 750rpx;
}

.shopping-cart {
    position: fixed;
    right: 0;
    bottom: var(--window-bottom);
    display: flex;
    align-items: center;
    height: 44px;
    padding-left: 32px;
    padding-right: 15px;
    background-image: linear-gradient(135deg, transparent 23px, $shrine-pink-50 23px);
    color: $shrine-pink-900;
    transition: width .4s ease-in;
    filter: drop-shadow(0 6px 7px rgba(0, 0, 0, .4));
    
    >.icon {
        margin: 5px;
    }
    
    >image {
        margin-left: 15px;
        width: 34px;
        height: 34px;
        border-radius: 4px;
    }
    
    >text {
        margin-left: 10px;
        font-size: 12px;
        font-weight: 600;
    }
}
</style>
