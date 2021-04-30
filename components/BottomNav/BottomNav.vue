<template>
    <view class="bottom-nav">
        <view class="avatar-base">
            <view class="background"></view>
            
            <navigator url="../Cart/Cart" style="position: relative;">
                <uni-icons class="icon-cart" type="cart-filled" size="24" />
            </navigator>
        </view>
            
        <navigator url="../User/User">
            <!-- #ifdef MP-WEIXIN -->
            <open-data
                v-if="loggedIn"
                class="avatar floating-box"
                type="userAvatarUrl"
                :default-avatar="avatarURL"
                style="display: block;"
            />
            <!-- #endif -->
            <!-- #ifndef MP-WEIXIN -->
            <image v-if="loggedIn" class="avatar floating-box" :src="avatarURL" mode="aspectFill" />
            <!-- #endif -->
            <view v-else class="avatar floating-box">
                <uni-icons type="person-filled" size="24" color="white" />
            </view>
        </navigator>
    </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    name:"BottomNav",
    data() {
        return {
            
        };
    },
    computed: {
        ...mapState('user', [
            'loggedIn'
            
        ]),
        ...mapGetters('user', [
            'avatarURL'
        ])
    }
}
</script>

<style lang="scss">
$bottom-nav-width: 150px;
$bottom-nav-height: 44px;

.bottom-nav {
    position: fixed;
    right: 0;
    bottom: var(--window-bottom);
    filter: drop-shadow(0 6px 7px rgba(0, 0, 0, .4));
    
    $ab-half-circle-radius: 32px;
    $ab-right-width: 8px;
    $ab-background-radius: $bottom-nav-width;
    $ab-background-border-width: $ab-background-radius - $ab-half-circle-radius;
    
    .avatar-base {
        position: relative;
        display: flex;
        align-items: center;
        width: $bottom-nav-width;
        height: $bottom-nav-height;
        padding-left: 32px;
        box-shadow: 0 0 5px 1px grey;
        // clip-path: path('M 32 0 H 74 A 34 34 0 0 0 142 0 H 150 V 44 H 0 V 32 Z');
        clip-path: polygon($ab-half-circle-radius 0, 100% 0, 100% 100%, 0 100%, 0 $ab-half-circle-radius);
        overflow: hidden;
        
        >.background {
            position: absolute;
            right: $ab-right-width - $ab-background-border-width;
            bottom: $bottom-nav-height - $ab-background-radius;
            width: $ab-background-radius * 2;
            height: $ab-background-radius * 2;
            border: $ab-background-border-width solid $shrine-pink-50;
            border-radius: 50%;
        }
    }
    
    $avatar-radius: 27px;
    .avatar {
        position: absolute;
        right: $ab-half-circle-radius - $avatar-radius + $ab-right-width;
        bottom: $bottom-nav-height - $avatar-radius;
        display: flex;
        justify-content: center;
        align-items: center;
        width: $avatar-radius * 2;
        height: $avatar-radius * 2;
        border: 1px solid $shrine-pink-900;
        border-radius: 50%;
        background-color: $shrine-pink-900;
        opacity: .9;
        overflow: hidden;
    }
}

.icon-cart {
    color: $shrine-pink-900;
}
</style>
