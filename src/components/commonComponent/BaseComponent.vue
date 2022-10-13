<template>
    <div id="bindDialog"></div>
</template>

<script>
import DialogNotification from './DialogNotification.vue'
import {createApp} from 'vue';
import {baseCallApi} from '../../common/js/BaseCallApi.js';
import { mapGetters } from 'vuex';
export default {
    name: "BaseClass",
    inject:["toast"],
    created(){
        let me = this;
        me.checkLogin();
    },
    mounted(){},
    computed:{
        ...mapGetters('tokenManage', ['tokenCallApi','isExistsToken'])
    },
    methods: {
        checkLogin()
        {
            let me = this;
            if(!me.isExistsToken)
            {
                debugger;
                me.$router.replace({path: '/login'})
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
            method = method.toLowerCase();
            optionCommon = option;
            if(!optionCommon.headers)
                optionCommon.headers = {};

            optionCommon.headers = {
                Authorization: `bearer ${me.isExistsToken ? me.tokenCallApi : ''}`
            }
            switch(method)
            {
                case 'get':
                    baseCallApi.Get(routeApi,data,optionCommon);
                    break;
                case 'post':
                    baseCallApi.Post(routeApi,data,optionCommon);
                    break;
                case 'put':
                    baseCallApi.Put(routeApi,data,optionCommon);
                    break;
                case 'delete':
                    baseCallApi.Delete(routeApi,data,optionCommon);
                    break;
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
