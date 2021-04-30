export default {
    namespaced: true,
    
    state: () => ({
        loggedIn: false,
        info: {}
    }),
    getters: {
        username: ({ info }) => info.username || info._id || '未登录',
        avatarURL: ({ info }) => info.avatar || '../../static/logo.png'
    },
    mutations: {
        SET_CURRENT_USER(state, { loggedIn, userInfo }) {
            state.loggedIn = loggedIn;
            state.info = userInfo;
        }
    },
    actions: {
        login({ commit }, userInfo) {
        	commit('SET_CURRENT_USER', { loggedIn: true, userInfo });
        },
        logout({ commit }) {
            commit('cart/SET_ITEMS', null, { root: true });
            commit('cart/SET_ITEM_COUNT', 0, { root: true });
        	
        	uni.removeStorageSync('user_info');
        	uni.removeStorageSync('uni_id_token');
        	uni.removeStorageSync('uni_id_token_expired');
        	commit('SET_CURRENT_USER', { loggedIn: false, userInfo: {} });
        }
    }
}