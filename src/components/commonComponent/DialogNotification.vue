<template>
    <Modal :configModal="configModal">
        <div>
            asdasd
        </div>
    </Modal>
</template>

<script>
import Modal from './Modal.vue';
export default {
    name: 'DialogNotification',
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
        let me = this;
    },
    methods:{
        
    },
    props:{
        configModal: {
            type: Object,
            default: function(rawProps)
            {
                return rawProps.configModal;
            }
        }
    },
    data(){
        return {
        }
    },
}
</script>

<style scoped>

</style>