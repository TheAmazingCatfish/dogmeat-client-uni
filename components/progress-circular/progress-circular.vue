<template>
    <view
        class="progress-circular"
        :class="{ 'progress-circular--indeterminate': indeterminate }"
        :style="{
            width: `${size}px`,
            height: `${size}px`
        }"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            :viewBox="`${viewBoxSize} ${viewBoxSize} ${2 * viewBoxSize} ${2 * viewBoxSize}`"
            :style="{ transform: `rotate(${Number(rotate)}deg)` }"
        >
            <circle
                v-if="!indeterminate"
                class="progress-circular__underlay"
                fill="transparent"
                :cx="2 * viewBoxSize"
                :cy="2 * viewBoxSize"
                :r="radius"
                :stroke-width="strokeWidth"
                :stroke-dasharray="strokeDashArray"
                stroke-dashoffset="0"
            />
            <circle
                class="progress-circular__overlay"
                fill="transparent"
                :cx="2 * viewBoxSize"
                :cy="2 * viewBoxSize"
                :r="radius"
                :stroke-width="strokeWidth"
                :stroke-dasharray="strokeDashArray"
                :stroke-dashoffset="strokeDashOffset"
            />
        </svg>
        
        <view class="progress-circular__info">
            <slot />
        </view>
    </view>
</template>

<script>
export default {
    name:"ProgressCircular",
    props: {
        indeterminate: Boolean,
        rotate: {
            type: [Number, String],
            default: 0
        },
        size: {
            type: [Number, String],
            default: 32
        },
        width: {
            type: [Number, String],
            default: 4
        },
        value: {
            type: [Number, String],
            default: 0
        }
    },
    data() {
        return {
            radius: 20
        };
    },
    computed: {
        circumference() {
            return 2 * Math.PI * this.radius;
        },
        normalizedValue() {
            if (this.value < 0) return 0;
            if (this.value > 100) return 100;
            return parseFloat(this.value);
        },
        strokeDashArray() {
            return Math.round(this.circumference * 1000) / 1000;
        },
        strokeDashOffset() {
            return (100 - this.normalizedValue) / 100 * this.circumference + 'px';
        },
        strokeWidth() {
            return Number(this.width) / +this.size * this.viewBoxSize * 2;
        },
        viewBoxSize() {
            return this.radius / (1 - Number(this.width) / +this.size);
        }
    },
    methods: {
        
    }
}
</script>

<style lang="scss">
$progress-circular-rotate-animation: progress-circular-rotate 1.4s linear infinite !default;
$progress-circular-rotate-dash: progress-circular-dash 1.4s ease-in-out infinite !default;
$process-circular-intermediate-svg-transition: all .2s ease-in-out !default;
$progress-circular-underlay-stroke: rgba(grey, 0.4) !default;
$progress-circular-overlay-transition: all .6s ease-in-out !default;

.progress-circular {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    vertical-align: middle;
    
    >svg {
        width: 100%;
        height: 100%;
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
    }
    
    &--indeterminate {
        >svg {
            animation: $progress-circular-rotate-animation;
            transform-origin: center center;
            transition: $process-circular-intermediate-svg-transition;
        }
        
        .progress-circular__overlay {
            animation: $progress-circular-rotate-dash;
            stroke-linecap: round;
            stroke-dasharray: 80, 200;
            stroke-dashoffset: 0px;
        }
    }
    
    &__info {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    &__underlay {
        stroke: $progress-circular-underlay-stroke;
        z-index: 1;
    }
    
    &__overlay {
        stroke: currentColor;
        z-index: 2;
        transition: $progress-circular-overlay-transition;
    }
    
    @keyframes progress-circular-dash {
        0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0px;
        }
        50% {
            stroke-dasharray: 100, 200;
            stroke-dashoffset: -15px;
        }
        100% {
            stroke-dasharray: 100, 200;
            stroke-dashoffset: -125px;
        }
    }
    
    @keyframes progress-circular-rotate {
        100% {
            transform: rotate(360deg);
        }
    }
}
</style>
