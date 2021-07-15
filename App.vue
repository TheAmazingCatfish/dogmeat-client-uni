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
@import '@/common/styles/reset.css';
@import '@/common/styles/main.scss';
</style>
