import { createStore } from 'vuex';
import {zindexManage} from './zindexManage.js';

var storeState = createStore({
    modules:{
        zindexManage: zindexManage
    }
});

export var storeState;