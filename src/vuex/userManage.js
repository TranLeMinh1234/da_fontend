import { createStore } from 'vuex';

const userManage = {
    namespaced: true,
    state: () => ({
        userInfo: null
    }),
    getters:{
        isExistsUserInfo(state)
        {
            return state.userInfo ? true: false;
        },
        userInfo (state)
        {
            return state.userInfo;
        }
    },
    mutations: {
        setUserInfo(state,userInfo)
        {
            state.userInfo = userInfo;
        },
        clearUserInfo(state){
            state.userInfo = null;
        }
    }
};

export default userManage;