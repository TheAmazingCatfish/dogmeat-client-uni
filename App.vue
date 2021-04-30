<script>
import { autoLogin } from './common/loginTool';

export default {
    onLaunch() {
        autoLogin();
    },
        
    onShow() {
        console.log('App Show');
    },
    onHide() {
        console.log('App Hide');
    }
}
</script>

<style lang="scss">
/*每个页面公共css */
@import '@/common/uni-ui.scss';

view {
    box-sizing: border-box;
}

button::after {
    $cut-size: 8px;
    
    width: 100%;
    height: 100%;
    z-index: -1;
    border: none;
    background-color: $shrine-pink-100;
    transform: none;
    clip-path: polygon(
        $cut-size 0,
        calc(100% - #{$cut-size}) 0,
        100% $cut-size,
        100% calc(100% - #{$cut-size}),
        calc(100% - #{$cut-size}) 100%,
        $cut-size 100%,
        0 calc(100% - #{$cut-size}),
        0 $cut-size
    );
}

button.dogmeat {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 44px;
    background-color: transparent;
    color: $shrine-pink-900;
    font-size: 14px;
    font-weight: 600;
    // box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, .4));
}

button.text-button {
    background-color: transparent;
}

.floating-box {
    box-shadow: 0 3px 5px -1px rgba(0, 0, 0, .2), 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0 rgba(0, 0, 0, .12);
}

.floating-object {
    filter: drop-shadow(0 6px 7px rgba(0, 0, 0, .4));
}
</style>
