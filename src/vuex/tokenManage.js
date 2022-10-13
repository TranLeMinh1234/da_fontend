import { createStore } from 'vuex';

const tokenManage = {
    namespaced: true,
    state: () => ({
        token: null
    }),
    getters:{
        isExistsToken (state)
        {
            return state.token ? true: false;
        },
        tokenCallApi (state)
        {
            return state.token;
        }
    },
    mutations: {
        setToken(state,token)
        {
            state.token = token;
        },
        clearToken(state){
            state.token = null;
        }
    }
};

export default tokenManage;