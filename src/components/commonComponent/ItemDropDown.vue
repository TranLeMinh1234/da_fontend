<template>
    <div class="item-dropdown">
        <div 
            :class="['item-component']" 
            @click="executeShowDropDown()"
        >
            <slot name="item"></slot>
        </div>
        <DropDown 
            :configDropDown="configDropDown"
            :isShowDropDown="isShowDropDown"
            :elementUseDropDown="elementUseDropDown"
            @hideDropDown="hideDropDown()"
        >
            <slot name="dropdown"></slot>
        </DropDown>
    </div>
</template>

<script>
import DropDown from './DropDown.vue';
export default {
    name: 'IconDropDown',
    components: {
        DropDown
    },
    created(){
        let me = this;
    },
    mounted(){
        let me = this;
        me.findPositionIcon();
    },
    watch: {
        isShowDropDown: function(newValue){
            let me = this;
            if(newValue)
            {
                me.findPositionIcon();
            }
        }
    },
    methods: 
    {
        executeShowDropDown()
        {
            let me = this;
            me.$emit('showDropDownEvent');
        },
        findPositionIcon()
        {
            let me = this;
            me.elementUseDropDown = me.$el.querySelector('.item-component');
            let postionIcon = me.elementUseDropDown.getBoundingClientRect();
            me.config.positionXShow = postionIcon.left + postionIcon.width/2;
            me.config.positionYShow = postionIcon.top + postionIcon.height/2;
            me.config.arrowPositionX = me.config.arrowPositionX? me.config.arrowPositionX: 0;
            me.config.arrowPositionY = me.config.arrowPositionY? me.config.arrowPositionY: 0;
            me.configDropDown = null;
            me.$nextTick(()=>{
                me.configDropDown = me.config;
            })
        },
        hideDropDown()
        {
            let me = this;
            me.$emit('closeDropDownEvent');
        }
    },
    props: {
        config: {
            type: Object,
            default: function(rawProps)
            {
                return rawProps.config != null && rawProps.config != undefined? rawProps.config: 
                {
                    width: 200,
                    height: 200,
                    arrowPositionX: 0,
                    arrowPositionY: 0,
                    directArrow: 'top',
                };
            }
        },
        iconClass:{
            type: String,
            default: ""
        },
        isShowDropDown: {
            type: Boolean,
            default: false
        }
    },
    data()
    {
        return {
            elementUseDropDown: null,
            configDropDown: undefined
        }
    }
}
</script>

<style scoped>
@import url(../../assets/css/componentCommon/ItemDropDown.css);
</style>