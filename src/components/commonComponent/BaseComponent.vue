<template>
    <div id="bindDialog"></div>
</template>

<script>
import DialogNotification from './DialogNotification.vue'
import {createApp} from 'vue';
import {baseCallApi} from '../../common/js/BaseCallApi.js';
import { mapGetters, mapMutations } from 'vuex';
export default {
    name: "BaseClass",
    inject:["toast"],
    created(){
        let me = this;
        me.checkLogin();
    },
    mounted(){},
    computed:{
        ...mapGetters('tokenManage', ['tokenCallApi','isExistsToken']),
        ...mapGetters('userManage', ['userInfo','isExistsUserInfo'])
    },
    methods: {
        ...mapMutations('userManage',['setUserInfo','clearUserInfo']),
        checkLogin()
        {
            let me = this;
            if(!me.isExistsToken)
            {
                me.$router.replace({path: '/login'})
            }
            else
            {
                if(!me.isExistsUserInfo)
                {
                    me.callApi('get','api/user/getUserInfo',null,null)
                    .then(res => {
                        if(res.data.success)
                        {
                            let data = res.data.data;
                            me.setUserInfo(data);
                        }
                    });
                }
            }
        },
        showDialogNotification(configModal, contentCustom, callBack)
        {
            let me = this;
            me.dialog?.unmount();

            var newDialog = createApp(DialogNotification,
                {
                    configModal: configModal,
                    contentCustom: contentCustom,
                    mainApp: ()=>{return me},
                    callBack: callBack
                },
            );
            newDialog.mount("#dialogBy");
            me.dialog= newDialog;
        },
        callApi(method, routeApi, data, option)
        {
            let me = this;
            method = method.toLowerCase();
            let optionCommon = option;
            if(!optionCommon)
                optionCommon = {};

            if(!optionCommon.headers)
                optionCommon.headers = {};

            optionCommon.headers = {
                Authorization: `bearer ${me.isExistsToken ? me.tokenCallApi : ''}`
            }
            switch(method)
            {
                case 'get':
                    return baseCallApi.Get(routeApi,data,optionCommon);
                case 'post':
                    return baseCallApi.Post(routeApi,data,optionCommon);
                case 'put':
                    return baseCallApi.Put(routeApi,data,optionCommon);
                case 'delete':
                    return baseCallApi.Delete(routeApi,data,optionCommon);
                default:
                    break;
            }
        }
    },
    props: {

    },
    data()
    {
        return {

        };
    }
}
</script>

<style>

</style>
