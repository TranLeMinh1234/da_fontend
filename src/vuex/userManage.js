import { createStore } from 'vuex';
import { commonFunction } from '../common/js/commFunction.js';

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
        setRoleForUser(state, role)
        {
            let newRole = {};
            for(var propertyName in role)
            {
                let propertyNameFormat = commonFunction.capitalizeFirstLetter(propertyName);
                newRole[propertyNameFormat] = role[propertyName];
            }
            state.userInfo.role = newRole;
        },
        clearUserInfo(state){
            state.userInfo = null;
        }
    }
};

export default userManage;