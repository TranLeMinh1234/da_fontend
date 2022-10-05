<template>
    <Teleport to="body">
        <div 
            class="background-modal" 
            :style="{
                zIndex: zindex
            }"
        >
            <div 
                class="modal" 
                :style="{
                    width: configModal.width + 'px',
                    height: configModal.height + 'px',
                }"
            >
                <slot></slot>
            </div>
        </div>
    </Teleport>
</template>

<script>
import {mapMutations, mapGetters} from 'vuex';
export default {
    name: 'Modal',
    created(){
        let me = this;
        me.generateBiggestZindex();
        me.zindex = me.getBiggestZindex;
    },
    mounted(){},
    computed:{
        ...mapGetters([
            'getBiggestZindex'
        ]),
    },
    beforeUnmount(){
        let me = this;
        me.clearBiggestIndex();
    },
    methods:{
        ...mapMutations([
            'generateBiggestZindex',
            'clearBiggestIndex'
        ]),
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
@import url('../../assets/css/componentCommon/Modal.css');
</style>