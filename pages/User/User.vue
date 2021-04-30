<template>
    <view class="user-home">
        <view class="left">
            <template v-if="loggedIn">
                <!-- #ifdef MP-WEIXIN -->
                <open-data class="avatar" type="userAvatarUrl" :default-avatar="avatarURL" style="display: block;" />
                <open-data class="username" type="userNickName" :default-text="username" />
                <!-- #endif -->
                <!-- #ifndef MP-WEIXIN -->
                <image class="avatar" :src="avatarURL" mode="aspectFill" />
                <text class="username">{{ username }}</text>
                <!-- #endif -->
            </template>
            <template v-else>
                <view class="avatar">
                    <uni-icons type="person-filled" size="24" color="white" />
                </view>
                <navigator url="/pages/User/Login">
                    <button class="username text-button">登录/注册</button>
                </navigator>
            </template>
        </view>
        
        <view v-if="loggedIn" class="right">
            <navigator url="../User/Options">
                <uni-icons class="icon-options" type="gear" size="24" />
            </navigator>
        </view>
    </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    data() {
        return {
            
        };
    },
    computed: {
        ...mapState('user', [
            'loggedIn'
        ]),
        ...mapGetters('user', [
            'username',
            'avatarURL'
        ])
    }
}
</script>

<style lang="scss">
.user-home {
    padding: 40rpx;
    background-color: $shrine-pink-100;
    
    display: flex;
    justify-content: space-between;
    
    >.left {
        display: flex;
        align-items: center;
    }
}

.avatar {
    $avatar-size: 120rpx;

    display: flex;
    justify-content: center;
    align-items: center;
    width: $avatar-size;
    height: $avatar-size;
    margin-right: 20px;
    border-radius: 50%;
    background-color: $shrine-pink-900;
    overflow: hidden;
}

.username {
    color: $shrine-pink-900;
    font-weight: 600;
}

.icon-options {
    color: $shrine-pink-900;
}
</style>
