<template>
    <Modal 
        :configModal="configModal" 
        :isShow="isShow" 
        :mainApp="mainApp"
    >
        <div class="title-dialog">
            <!-- <div class="icon-dialog file-icon app-icon"></div> -->
            {{contentCustom.title}}
        </div>
        <div class="content-dialog">
            {{contentCustom.content}}
        </div>
        <div class="footer-confirm-dialog">
            <button class="btn btn-white-silver mg-r-10" @click="close()">Đóng</button> 
            <button class="btn btn-primary" @click="confirm()">Xác nhận</button>
        </div>
    </Modal>
</template>

<script>
import Modal from './Modal.vue';
export default {
    name: 'DialogConfirm',
    components:{
        Modal
    },
    created(){
        let me = this;
    },
    mounted(){},
    computed:{
        
    },
    beforeUnmount(){
    },
    beforeDestroy() {
    },
    methods:{
        confirm()
        {
            let me = this;
            if(typeof me.callBack == 'function')
            {
                me.callBack();
            }
            me.isShow = false;
        },
        close()
        {
            let me = this;
            me.isShow = false;
        }
    },
    props:{
        configModal: {
            type: Object,
            default: function(rawProps)
            {
                return rawProps.configModal ? rawProps.configModal : {
                    width: "400px",
                    height: "auto",
                    borderTop: true
                };
            },
        },
        contentCustom:{
            type: Object,
            default: function(rawProps)
            {
                let contentResult = rawProps.contentCustom ? rawProps.contentCustom : 
                {
                    title: '',
                    content: '',
                };
                return contentResult;
            }
        },
        mainApp:{
            type: [Function],
            default: function(rawProps)
            {
                return rawProps.mainApp;
            }
        },
        callBack: {
            type: Function,
            default: function(rawProps)
            {
                return rawProps?.callBack ? rawProps.callBack : ()=>{};
            }
        }
    },
    data(){
        return {
            isShow: true,
        }
    },
}
</script>

<style scoped>
@import url('../../assets/css/componentCommon/DialogConfirm.css');
</style>