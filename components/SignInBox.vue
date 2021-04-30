<template>
    <view class="container">
        <view class="square">
            <view class="top"></view>
            <view class="middle"></view>
            <view class="bottom"></view>
            <view class="half-circle"></view>
            <view class="background"></view>
        </view>
        <view class="circle"></view>
    </view>
</template>

<script>
export default {
    name:"SignInBox",
    data() {
        return {
            
        };
    }
}
</script>

<style>
.container {
    padding: 20px;
    height: 100vh;
    background-color: #002D3D;
    font-size: 14px;
    line-height: 24px;
}

.square, .square > view { box-sizing: border-box; }
.square { 
    width: 300px; 
    position: fixed; 
    top: calc(50% - 200px);
    left: calc(50% - 150px);
    overflow: hidden;
    
    >.top { 
        border: 1px solid #fff;
        height: 170px;
        border-radius: 5px 5px 0 0;
        border-width: 1px 1px 0 1px; 
    }
    >.middle { 
        border-left: 1px solid #fff; 
        height: 60px;
    }
    >.bottom { 
        border: 1px solid #fff;
        height: 170px;
        border-radius: 0 0 5px 5px;
        border-width: 0px 1px 1px 1px; 
    }
    >.half-circle { 
        border: 1px solid #fff;
        position: absolute;
        width: 30px;
        height: 60px;
        border-width: 1px 0px 1px 1px;
        border-radius: 30px 0 0 30px;
        top: calc(50% - 30px);
        right: 0;
    }
    >.background {
        border: 360px solid rgba(255,255,255,0.3);
        position: absolute;
        width: 780px;
        height: 780px;
        border-radius: 50%;
        top: calc(50% - 390px);
        right: -390px;
    }
}

.circle { 
    width: 50px;
    height: 50px;
    border: 1px solid #fff;
    border-radius: 50%;
    position: fixed;
    top: calc(50% - 25px);
    left: calc(50% + 125px);
    background-color: rgba(255,255,255,.3);
    box-sizing: border-box;
}
</style>
