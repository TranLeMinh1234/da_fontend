import { createStore } from 'vuex';
import tokenManage from './tokenManage';
import createPersistedState from "vuex-persistedstate";

var storeState = createStore({
    namespaced: true,
    modules:{
        tokenManage: tokenManage
    },
    plugins: [createPersistedState()]
});

export var storeState;