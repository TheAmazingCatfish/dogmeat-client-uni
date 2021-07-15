<template>
	<view>
        <!--
        本页面模板教程：https://ext.dcloud.net.cn/plugin?id=2671
        uni-list 文档：https://ext.dcloud.net.cn/plugin?id=24
        uniCloud 文档：https://uniapp.dcloud.io/uniCloud/README
        uni-clientDB 组件文档：https://uniapp.dcloud.net.cn/uniCloud/uni-clientdb-component
        DB Schema 规范：https://uniapp.dcloud.net.cn/uniCloud/schema
         -->
        <view class="list">
            <!-- 刷新页面后的顶部提示框 -->
            <!-- 当前弹出内容没有实际逻辑 ，可根据当前业务修改弹出提示 -->
            <view class="tips" :class="{ 'tips-ani': tipShow }">为您更新了商品信息</view>
            
            <unicloud-db
                ref="udb"
                #default="{ data, loading, error, options }"
                :options="formData"
                :collection="collection"
                :field="field"
                @load="load"
            >
                <view v-if="error">{{ error.message }}</view>
                
                <!-- 基于 uni-list 的页面布局 -->
                <uni-list v-else class="uni-list--waterfall" :border="false">
                    <!-- to 属性携带参数跳转详情页面，当前只为参考 -->
                    <uni-list-item
                        class="uni-list-item--waterfall"
                        v-for="item in data" :key="item._id"
                        :to="`/pages/product/product?id=${item._id}&title=${item.name}`"
                        title="自定义商品列表"
                        :border="false"
                    >
                        <!-- 通过header插槽定义列表左侧图片 -->
                        <template #header>
                            <view class="uni-thumb product-image product-image-column">
                                <image :src="item.thumbnail" mode="aspectFill" />
                                
                                <overlay v-if="item.stock < 1" absolute>
                                    <view class="tip-sold-out">
                                        <text>无货</text>
                                        <text>----- · -----</text>
                                        <text>Sold out</text>
                                    </view>
                                </overlay>
                            </view>
                        </template>
                        
                        <!-- 通过body插槽定义商品布局 -->
                        <template #body>
                            <view class="shop">
                                <view>
                                    <view class="uni-title">
                                        <text class="uni-ellipsis-2">{{ item.name }}</text>
                                    </view>
                                    
                                    <view>
                                        <text class="uni-tag hot-tag">{{ item.special_tag }}</text>
                                        <text v-for="tag in item.tags" :key="tag" class="uni-tag">{{ tag }}</text>
                                    </view>
                                </view>
                                
                                <view>
                                    <view class="shop-price">
                                        <text>¥</text>
                                        <text class="shop-price-text">{{ item.price }}</text>
                                        <text>.00</text>
                                    </view>
                                    
                                    <view class="uni-note">{{ item.comment_count }}条评论 月销量 {{ item.monthly_sales }}</view>
                                    
                                    <view class="uni-note ellipsis">
                                        <text class="uni-ellipsis-1">{{ item.shop_name }}</text>
                                        <text class="uni-link">进店 ></text>
                                    </view>
                                </view>
                            </view>
                        </template>
                    </uni-list-item>
                </uni-list>
                
                <!-- 通过 loadMore 组件实现上拉加载效果，如需自定义显示内容，可参考：https://ext.dcloud.net.cn/plugin?id=29 -->
                <uni-load-more v-if="loading || options.status === 'noMore' " :status="options.status" />
            </unicloud-db>
        </view>
        
        <button
            class="floating-action-button scroll-to-top"
            :class="{ hidden: !showScrollToTopButton }"
            @click="scrollToTop"
        >
            <uni-icons type="arrowup" />
        </button>
        
        <bottom-nav />
	</view>
</template>

<script>
export default {
    data() {
        return {
            // 数据表名
            collection: 'opendb-mall-goods',
            // 查询字段，多个字段用 , 分割
            field: 'thumbnail,name,special_tag,tags,price,stock,comment_count,monthly_sales,shop_name',
            formData: {
                status: 'loading', // 加载状态
            },
            showScrollToTopButton: false,
            tipShow: false // 是否显示顶部提示框
        };
    },
    onLoad() {},
    /**
     * 下拉刷新回调函数
     */
    onPullDownRefresh() {
        this.tipShow = true;
        this.formData.status = 'more';
        this.$refs.udb.loadData({
            clear: true
        }, () => {
            this.tipShow = false;
            uni.stopPullDownRefresh();
        });
    },
    /**
     * 上拉加载回调函数
     */
    onReachBottom() {
        this.$refs.udb.loadMore();
    },
    onPageScroll(event) {
        if (event.scrollTop > 400) {
            this.showScrollToTopButton = true;
        } else {
            this.showScrollToTopButton = false;
        }
    },
    methods: {
        scrollToTop() {
            uni.pageScrollTo({
                scrollTop: 0
            });
        },
        load(data, ended) {
            if (ended) {
                this.formData.status = 'noMore';
            }
        }
    }
};
</script>

<style lang="scss">
page {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background-color: $shrine-pink-100;
    min-height: 100%;
    height: auto;
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
    width: 110px;
    height: 110px;
}

.product-image-column {
    position: relative;
    width: 100%;
    height: 170px;
    margin-bottom: 10px;
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

.shop-price {
    margin-top: 5px;
    font-size: 12px;
    color: #ff5a5f;
}

.shop-price-text {
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

.uni-ellipsis-2 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.angled-cut {
    // background-image: linear-gradient(135deg, transparent 80rpx, white 80rpx);
    clip-path: polygon(64rpx 0, 100% 0, 100% 100%, 0 100%, 0 64rpx);
}

// 默认加入 scoped ，所以外面加一层提升权重
.list {
    // position: fixed;
    height: 100%;
    padding-bottom: 44px;
    background-color: white;
    overflow: scroll;
    
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

button.scroll-to-top {
    position: fixed;
    left: 13px;
    bottom: 17px;
    background-color: $shrine-pink-900;
    color: white;
    opacity: .9;
}
</style>
