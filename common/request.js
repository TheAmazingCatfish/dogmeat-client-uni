import apis from './apis';
import { loginByWeixin } from './loginTool';

let reLoggingIn = false;

function directToLogin(message) {
    uni.showModal({
        content: message,
        confirmText: '去登录',
        success(response) {
            if (response.confirm) {
                uni.navigateTo({
                    url: '/pages/User/Login'
                });
            }
        }
    });
}

async function request(action, data) {
    try {
        const { result } = await apis[action](data);
        
        // uni-id 错误码
        switch (result.code) {
            // 云端已不包含此 token
            case 30202:
                directToLogin('登录过期了，先重新登录吧~');
                break;
            
            // token 已过期
            case 30203:
                if (!reLoggingIn) {
                    reLoggingIn = true;
                    try {
                        await loginByWeixin();
                        const { result } = await apis[action](data);
                        return result;
                    } catch (error) {
                        console.error(error);
                        return Promise.reject(error);
                    } finally {
                        reLoggingIn = false;
                    }
                }
                break;
            
            // token 校验未通过
            case 30204:
                directToLogin('还未登录，先去登录吧~');
                break;
            
            default:
                break;
        }
        
        return result;
    } catch (error) {
        // clientDB 错误码
        switch (error.code) {
            case 'TOKEN_INVALID':
                directToLogin('登录过期了，先重新登录吧~');
                break;
            
            case 'TOKEN_INVALID_ANONYMOUS_USER':
                directToLogin('还未登录，先去登录吧~');
                break;
                
            case 'TOKEN_INVALID_TOKEN_EXPIRED':
                if (!reLoggingIn) {
                    reLoggingIn = true;
                    try {
                        await loginByWeixin();
                        const { result } = await apis[action](data);
                        return result;
                    } catch (error) {
                        console.error(error);
                        return Promise.reject(error);
                    } finally {
                        reLoggingIn = false;
                    }
                }
                break;
                
            default: 
                uni.showModal({
                    content: error.message,
                    showCancel: false
                });
                break;
        }
        
        return Promise.reject(error);
    }
}

export default request;