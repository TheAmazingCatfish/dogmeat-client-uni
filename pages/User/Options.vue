<template>
    <view>
        <navigator class="setting" url="/pages/address/addresses">
            <text>地址管理</text>
            <uni-icons type="arrowright" />
        </navigator>
        
        <button class="logout dogmeat" type="warn" @tap="logout">登出</button>
    </view>
</template>

<script>
export default {
    data() {
        return {
            
        };
    },
    methods: {
        logout() {
            uniCloud.callFunction({
                name: 'user-center',
                data: {
                    action: 'logout'
                },
                success: res => {
                    console.log(res);
                    this.$store.dispatch('user/logout');
                    
                    uni.showToast({
                        title: '登出成功',
                        icon: 'success'
                    });
                    
                    uni.navigateBack();
                },
                fail: e => {
                    console.error(e)
                    uni.showModal({
                        showCancel: false,
                        content: '登出失败，请稍后再试'
                    });
                }
            })
        }
    }
}
</script>

<style lang="scss">
.setting {
    display: flex;
    justify-content: space-between;
    padding: $uni-spacing-row-lg;
    color: $shrine-pink-900;
}

button.logout {
    &::after {
        background-color: $uni-color-accent;
    }
    
    margin: $uni-spacing-row-base;
    color: white;
}
</style>
