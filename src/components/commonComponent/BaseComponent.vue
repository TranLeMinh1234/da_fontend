<template>
    <div id="bindDialog"></div>
</template>

<script>
import DialogNotification from './DialogNotification.vue'
import {createApp} from 'vue';
export default {
    name: "BaseClass",
    inject:["toast"],
    created(){
        let me = this;
    },
    mounted(){},
    methods: {
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
