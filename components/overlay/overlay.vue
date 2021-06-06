<template>
    <view
        class="overlay"
        :class="{
            'overlay--absolute': absolute,
            'overlay--active': isActive
        }"
        :style="{ zIndex }"
    >
        <view class="overlay__scrim" :style="{ opacity: Number(scrimOpacity) }"></view>
        
        <view class="overlay__content">
            <slot></slot>
        </view>
    </view>
</template>

<script>
import toggleable from '../../mixins/toggleable';

export default {
    name:"Overlay",
    mixins: [toggleable],
    props: {
        absolute: Boolean,
        scrimColor: String,
        scrimOpacity: {
            type: [Number, String],
            default: 0.4
        },
        value: {
            default: true
        },
        zIndex: {
            type: [Number, String],
            default: 0
        }
    }
};
</script>

<style lang="scss">
// Block
.overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    pointer-events: none;
    transition: opacity, z-index 1ms;
}

// Element
.overlay__content {
    position: relative;
}

.overlay__scrim {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background-color: $shrine-pink-100;
    transition: inherit;
    will-change: opacity;
}

// Modifier
.overlay--absolute {
    position: absolute;
}

.overlay--active {
    pointer-events: auto
}
</style>
