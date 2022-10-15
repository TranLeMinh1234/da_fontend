import { createStore } from 'vuex';
import tokenManage from './tokenManage';
import userManage from './userManage';
import createPersistedState from "vuex-persistedstate";

var storeState = createStore({
    namespaced: true,
    modules:{
        tokenManage: tokenManage,
        userManage: userManage
    },
    plugins: [createPersistedState()]
});

export var storeState;