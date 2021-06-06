<template>
    <view>
        <uni-list class="address-list">
            <uni-list-item
                v-for="address in addresses"
                :key="address._id"
                class="delivery-address"
                title="收货地址"
            >
                <template #body>
                    <view class="address-info">
                        <view class="d-flex align-center">
                            <view v-if="address.is_default" class="tag default">默认</view>
                            <view v-if="address.alias" class="tag address-type">{{ address.alias }}</view>
                            <text class="location">{{ address.general }}</text>
                        </view>
                        
                        <view class="detailed-address">{{ address.details }}</view>
                        
                        <view class="consignee-info">
                            <text class="consignee">{{ address.consignee }}</text>
                            <text>{{ address.mobile.replace(/(?<=^\d{3})\d{4}/, '****') }}</text>
                        </view>
                    </view>
                </template>
                
                <template #footer>
                    <view class="d-flex justify-center align-center">
                        <button class="edit-button plain" @tap="goToAddressEditor('modify', address)">
                            <uni-icons type="compose" />
                        </button>
                    </view>
                </template>
            </uni-list-item>
        </uni-list>
        
        <button class="add-new-address dogmeat" @tap="goToAddressEditor">
            <uni-icons type="plusempty" size="20" />
            <text> 新建收货地址</text>
        </button>
    </view>
</template>

<script>
export default {
    data() {
        return {
            addresses: []
        };
    },
    onLoad() {
        this.getAddresses();
    },
    onReachBottom() {
        console.log('bottom reached');
    },
    methods: {
        async getAddresses() {
            uni.showLoading();
            
            try {
                const { data } = await this.$request('getAddresses');
                
                this.addresses = data;
            } catch (error) {
                uni.showToast({
                    icon: 'none',
                    title: error.message
                });
            } finally {
                uni.hideLoading();
            }
        },
        goToAddressEditor(action, address) {
            uni.navigateTo({
                url: '/pages/address/address' + (action === 'modify' ? `?id=${address._id}` : ''),
                events: {
                    addressDataUpdated: () => this.getAddresses()
                },
                success(res) {
                    address && res.eventChannel.emit('passAddressData', address);
                }
            });
        }
    }
};
</script>

<style lang="scss">
.address-list {
    // height: calc(100vh - var(--window-top) - #{$uni-spacing-col-lg * 2 + 44px});
    
    /* #ifdef MP-WEIXIN */
    /deep/.uni-list {
    /* #endif */
    
        padding-bottom: $uni-spacing-col-lg * 2 + 44px;
    
    /* #ifdef MP-WEIXIN */
    }
    /* #endif */
}

.address-info {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.tag {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
    width: 28px;
    height: 14px;
    border-radius: 3px;
    font-size: 10px;
    
    &.default {
        background-color: $shrine-pink-900;
        color: white;
    }
    
    &.address-type {
        border: 1px solid $shrine-pink-900;
        background-color: $shrine-pink-100;
        color: $shrine-pink-900;
    }
}

.location,
.consignee-info {
    color: rgba($shrine-pink-900, .7);
    font-size: 12px;
}

.consignee {
    margin-right: 12px;
}

.detailed-address {
    color: $shrine-pink-900;
    font-size: 14px;
    font-weight: 700;
}

.edit-button {
    color: $shrine-pink-900;
    font-size: 14px;
    font-weight: 700;
}

button.add-new-address {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    margin: $uni-spacing-col-lg $uni-spacing-row-lg;
}
</style>
