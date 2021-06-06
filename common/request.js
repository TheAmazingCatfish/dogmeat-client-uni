import apis from './apis';
import { loginByWeixin } from './loginTool';
import store from '../store';

let refreshingToken = false;
let pendingRequests = [];

function directToLogin(message) {
    uni.showModal({
        content: message,
        confirmText: '去登录',
        success(response) {
            if (response.confirm) {
                uni.navigateTo({
                    url: '/pages/user/login'
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
                /*
                * token 过期的响应可能在新 token 取得后才到达，此时 refreshingToken 标记的值为 false，
                * 这将导致重复调用刷新 token 的逻辑，所以先判断当前 token 是否有效。
                */
                if (store.state.user.tokenExpires > Date.now()) {
                    return request(action, data);
                }
                
                // 将请求存入队列，直到取得新的 token 后，才继续执行挂起的请求
                const retry = new Promise((resolve) => {
                    pendingRequests.push((token) => {
                        // 在这里可以设置新的 token 到请求参数
                        
                        resolve(request(action, data));
                    });
                });
                if (!refreshingToken) {
                    refreshingToken = true;
                    try {
                        const { token } = await loginByWeixin();
                        
                        // 取得新的 token 后，继续执行挂起的请求
                        pendingRequests.forEach(callback => callback(token));
                        pendingRequests = [];
                    } catch (error) {
                        console.error(error);
                    } finally {
                        refreshingToken = false;
                    }
                }
                return retry;
            
            // token 校验未通过
            case 30204:
                directToLogin('还未登录，先去登录吧~');
                break;
            
            default:
                break;
        }
        
        return result;
    } catch (error) {
        console.log(error.code);
        // clientDB 错误码
        switch (error.code) {
            case 'TOKEN_INVALID':
                directToLogin('登录过期了，先重新登录吧~');
                break;
            
            case 'TOKEN_INVALID_ANONYMOUS_USER':
                directToLogin('还未登录，先去登录吧~');
                break;
                
            case 'TOKEN_INVALID_TOKEN_EXPIRED':
                /*
                * token 过期的响应可能在新 token 取得后才到达，此时 refreshingToken 标记的值为 false，
                * 这将导致重复调用刷新 token 的逻辑，所以先判断当前 token 是否有效。
                */
                if (store.state.user.tokenExpires > Date.now()) {
                    return request(action, data);
                }
                
                // 将请求存入队列，直到取得新的 token 后，才继续执行挂起的请求
                const retry = new Promise((resolve) => {
                    pendingRequests.push((token) => {
                        // 在这里可以设置新的 token 到请求参数
                        
                        resolve(request(action, data));
                    });
                });
                if (!refreshingToken) {
                    refreshingToken = true;
                    try {
                        const { token } = await loginByWeixin();
                        
                        // 取得新的 token 后，继续执行挂起的请求
                        pendingRequests.forEach(callback => callback(token));
                        pendingRequests = [];
                    } catch (error) {
                        console.error(error);
                    } finally {
                        refreshingToken = false;
                    }
                }
                return retry;
                
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