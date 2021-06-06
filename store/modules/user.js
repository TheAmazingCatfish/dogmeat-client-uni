export default {
    namespaced: true,
    
    state: () => ({
        info: uni.getStorageSync('user_info') || null,
        token: uni.getStorageSync('uni_id_token') || undefined,
        tokenExpires: uni.getStorageSync('uni_id_token_expired') || undefined
    }),
    getters: {
        loggedIn: ({ info }) => !!info || false,
        avatarURL: ({ info }, { loggedIn }) => loggedIn ? info.avatar || '../../static/logo.png' : '',
        id: ({ info }, { loggedIn }) => loggedIn ? info._id : '',
        username: ({ info }, { loggedIn }) => loggedIn ? info.username || info._id : '未登录'
    },
    mutations: {
        SET_USER_INFO(state, userInfo) {
            state.info = userInfo;
        },
        SET_TOKEN(state, { token, tokenExpires }) {
            state.token = token;
            state.tokenExpires = tokenExpires;
        }
    },
    actions: {
        login({ commit }, { userInfo, token, tokenExpires }) {
        	commit('SET_USER_INFO', userInfo);
            commit('SET_TOKEN', { token, tokenExpires });
        },
        logout({ commit }) {
            commit('cart/SET_ITEMS', null, { root: true });
            commit('cart/SET_ITEM_COUNT', undefined, { root: true });
        	
        	uni.removeStorageSync('user_info');
        	uni.removeStorageSync('uni_id_token');
        	uni.removeStorageSync('uni_id_token_expired');
        	commit('SET_USER_INFO', null);
            commit('SET_TOKEN', { token: undefined, tokenExpires: undefined });
        }
    }
}