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
        if(me.$refs.bgModal)
        {
            me.addScrolls = me.$refs.bgModal.querySelectorAll('.add-scroll');
            me.modal = me.$refs.bgModal.querySelector('.modal');

            // create an Observer instance
            const resizeObserver = new ResizeObserver(entries => 
                console.log('Body height changed:', entries[0].target.clientHeight)
            )

            // start observing a DOM node
            resizeObserver.observe(me.modal)

        }
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
                if(me.$refs.bgModal)
                {
                    me.addScrolls = me.$refs.bgModal.querySelectorAll('.add-scroll');
                    me.modal = me.$refs.bgModal.querySelector('.modal');

                    // create an Observer instance
                    const resizeObserver = new ResizeObserver(entries => {
                            me.addScrolls.forEach(addScroll => {
                                if(document.body.offsetHeight - me.modal.offsetHeight < 0)
                                    addScroll.style.height = Math.abs((document.body.offsetHeight - me.modal.offsetHeight)) + 'px';
                            });
                        }
                    )

                    // start observing a DOM node
                    resizeObserver.observe(me.modal)
                }
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