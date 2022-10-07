<template>
    <Teleport to="body">
        <div 
            v-if="isShow"
            class="background-modal" 
            :style="{
                zIndex: zindex
            }"
        >
            <div 
                :class="['modal', configModal.borderTop ? 'border-top':'']"
                :style="{
                    width: configModal.width,
                    height: configModal.height,
                }"
            >
                <slot></slot>
            </div>
        </div>
    </Teleport>
</template>

<script>
export default {
    name: 'Modal',
    created(){
        let me = this;
        me.zindex = typeof me.mainApp == "function"? 
        me.mainApp().$zindexManage.getBiggestZindex() 
        : this.$zindexManage.getBiggestZindex();
    },
    mounted(){},
    computed:{
        
    },
    watch: {
        isShow()
        {
            let me = this;
            typeof me.mainApp == "function"? me.mainApp().$zindexManage.clearBiggestIndex() 
            : this.$zindexManage.clearBiggestIndex();
        }
    },
    beforeUnmount(){
        
    },
    methods:{
       
    },
    props:{
        configModal: {
            type: Object,
            default: function(rawProps)
            {
                return rawProps.configModal? rawProps.configModal:
                {
                    width: "200px",
                    height: "300px",
                    borderTop: false
                };
            }
        },
        isShow: {
            type: Boolean,
            default: function(rawProps)
            {
                return true;
            }
        },
        mainApp:{
            type: [Function],
            default: function(rawProps)
            {
                return rawProps.mainApp;
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