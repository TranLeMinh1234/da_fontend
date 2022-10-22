<template>
    
</template>

<script>
import Modal from './Modal';
import BaseComponent from './BaseComponent.vue';

export default {
    name: "BaseViewDetail",
    extends: BaseComponent,
    components: 
    {
    },
    methods:{
        showDetail(nameComponent, configModal, props, callbackOutsideComponent)
        {
            let me = this;
            me.nameDetailComponent = nameComponent;
            me.props = props;
            me.configModal = configModal;
            me.isShowDetail = true;
            me.callbackOutsideComponent = callbackOutsideComponent;
        },
        closePopup(callbackInsideComponent)
        {
            let me = this;
            me.nameDetailComponent = '';
            me.configModal = undefined;
            me.props = undefined;
            me.data = undefined;
            me.callbackOutsideComponent = undefined;
            if(callbackInsideComponent)
            {
                callbackInsideComponent(me);
            }
            me.isShowDetail = false;
        }
    },
    data()
    {
        return {
            nameDetailComponent: '',
            props: undefined,
            isShowDetail: false,
            configModal: undefined,
            callbackOutsideComponent: null
        }
    }
}
</script>

<style scoped>

</style>