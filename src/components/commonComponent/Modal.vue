<template>
    <Teleport to="body">
        <div 
            v-if="isShow"
            class="background-modal" 
            :style="{
                zIndex: zindex
            }"
            ref="bgModal"
        >
            <div 
                class="add-scroll"
                :style="{
                    width: '100%',
                    backgroundColor: 'transparent'
                }"
            >
            </div>
            <div 
                :class="['modal', configModal.borderTop ? 'border-top':'']"
                :style="{
                    width: configModal.width,
                    height: configModal.height,
                }"
            >
                <slot></slot>
            </div>
            <!-- <div 
                class="add-scroll"
                :style="{
                    width: '100%',
                    backgroundColor: 'transparent'
                }"
            >
            </div> -->
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
    mounted(){
        let me = this;
        if(me.isShow)
        {
           me.calculate();
        }
    },
    computed:{
        
    },
    watch: {
        isShow(newValue)
        {
            let me = this;
            if(!me.isShow)
            {
                typeof me.mainApp == "function"? me.mainApp().$zindexManage.clearBiggestIndex() 
                : this.$zindexManage.clearBiggestIndex();
            }
            else
            {
                me.calculate();
            }
        }
    },
    beforeUnmount(){
        
    },
    methods:{
       calculate()
       {
            let me = this;
            me.$nextTick(()=>{
                let addScrolls = me.$refs.bgModal.querySelectorAll('.add-scroll');
                let modal = me.$refs.bgModal.querySelector('.modal');   
                addScrolls.forEach(addScroll => {
                    if(document.body.offsetHeight - modal.offsetHeight < 0)
                        addScroll.style.height = Math.abs((document.body.offsetHeight - modal.offsetHeight)) + 'px';
                });
            })
       }
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