<template>
	<view class="login">
		<!-- #ifdef MP-WEIXIN -->
		<open-data class="avatar" type="userAvatarUrl" :default-avatar="avatarURL" style="display: block;" />
        <br />
        <button class="wechat-login dogmeat" @tap="login">
            <uni-icons type="weixin" size="24" />
            <text>微信登录</text>
        </button>
		<!-- #endif -->
        <!-- #ifndef MP-WEIXIN -->
        <text>登录逻辑待开发...</text>
        <!-- #endif -->
	</view>
</template>

<script>
import { loginByWeixin } from '@/common/loginTool';

export default {
    data() {
        return {
            
        };
    },
    methods: {
        async login() {
            // #ifdef MP-WEIXIN
            await loginByWeixin();
            uni.showToast({
                title: '登录成功',
                icon: 'success'
            });
            uni.navigateBack();
            // #endif
        }
    }
}
</script>

<style lang="scss">
.login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: $shrine-pink-50;
}

.avatar {
    $size: 120px;
    
    width: $size;
    height: $size;
    border-radius: 50%;
    overflow: hidden;
}

button.wechat-login {
    &::after {
        background-color: #07c160;
    }
    
    width: 200px;
    margin-top: 45px;
    color: white;
    
    >text {
        margin-left: 5px;
    }
}
</style>
