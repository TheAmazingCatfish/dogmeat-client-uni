import store from '../store';

async function checkToken() {
    try {
        const { result } = await uniCloud.callFunction({
            name: 'user-center',
            data: {
                action: 'checkToken'
            }
        });
        console.log('token 校验结果：', result);
        const { code, token, tokenExpired } = result;
        
        if (token) {
            uni.setStorageSync('uni_id_token', token);
            uni.setStorageSync('uni_id_token_expired', tokenExpired);
        }
    } catch (error) {
        console.error(error);
        uni.showModal({
            showCancel: false,
            content: '请求云函数失败，请稍后再试'
        });
    }
}

function getCode(provider) {
    return new Promise((resolve, reject) => {
        uni.login({
            provider,
            success(res) {
                resolve(res.code);
            },
            fail(err) {
                reject(err);
            }
        })
    })
}

async function loginByWeixin() {
    try {
        const weixinCode = await getCode('weixin');
        
        const { result } = await uniCloud.callFunction({
            name: 'user-center',
            data: {
                action: 'loginByWeixin',
                params: {
                    code: weixinCode,
                }
            }
        });
        console.log(result);
        if (result.code !== 0) {
            return uni.showModal({
                showCancel: false,
                content: result.message
            });
        }
        
        const { type, token, tokenExpired, userInfo = {} } = result;
        
        if (type === 'register') {
            const { uid, openid, unionid } = result;
            userInfo._id = uid;
            userInfo.wx_openid['mp-weixin'] = openid;
            userInfo.unionid = unionid;
        }
        
        uni.setStorageSync('uni_id_token', token);
        uni.setStorageSync('uni_id_token_expired', tokenExpired);
        uni.setStorageSync('user_info', userInfo);
        store.dispatch('user/login', userInfo);
    } catch (error) {
        console.error(error)
        uni.showModal({
            showCancel: false,
            content: '登录失败，请稍后再试'
        });
    }
}

async function autoLogin() {
    // 判断是否有获取用户信息的权限，若用户未授权，则不自动登录
    // const [errorGettingSetting, { authSetting }] = await uni.getSetting();
    // console.log(authSetting);
    // if (!authSetting['scope.userInfo']) return;
    
    // 判断是否保存有用户信息，若没有，则不自动登录
    const userInfo = uni.getStorageSync('user_info');
    if (!userInfo) return;
    
    // 判断 token 是否过期，若过期，则重新登录；若到达刷新阈值，则刷新 token
    const tokenExpires = uni.getStorageSync('uni_id_token_expired');
    if (tokenExpires < Date.now()) {
        // #ifdef MP-WEIXIN
        return loginByWeixin();
        // #endif
    }
    if (tokenExpires - Date.now() < 600000) {
        checkToken();
    }
    
    store.dispatch('user/login', userInfo);
}

export { checkToken, getCode, loginByWeixin, autoLogin };