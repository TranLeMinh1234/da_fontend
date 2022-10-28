<template>
    <div class="local-combobox">
        <div 
            :class="['display-value-box','d-flex',
            'al-center', disabled? 'pe-none disabled-input':'',
            haveBorder? 'custom-border-box': '']" 
            @click="showDropDown"
        >
            <div class="txt-threedots">{{data[indexItemSelected][configField.displayField]}}</div>
            <div class="file-icon black-down-arrow-icon"></div>
        </div>
        <DropDown 
            :configDropDown="configInside"
            :isShowDropDown="isShowDropDown"
            :elementUseDropDown="elementUseDropDown"
            :isHaveArrow="false"
            @hideDropDown="hideDropDown()"
        >
            <div
                v-for="(dataItem, index) in data" :key="index"
                @click="selectItem(dataItem,index)"
                class="local-combobox-select-item"
            >
                {{dataItem[configField.displayField]}}
            </div>
        </DropDown>
    </div>
</template>

<script>
import BaseDataControl from './BaseDataControl.vue';
import DropDown from './DropDown.vue'; 

export default {
    name: 'LocalCombobox',
    extends: BaseDataControl,
    
    components: {
        DropDown
    },
    created()
    {
        let me = this;
        let indexItemBinding = me.data.findIndex(item => item[me.configField.valueField] == me.modelValue);
        if(indexItemBinding == -1 && me.data && me.data.length > 0)
        {
            me.indexItemSelected = 0;
            me.$emit('update:modelValue', me.data[0][me.configField.valueField]);
        }
        else
        {
            me.indexItemSelected = indexItemBinding;
        }
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
    props:
    {
        disabled: {
            type: Boolean,
            default: false
        },
        configField: {
            type: Object,
            default: function(rawProps)
            {
                return rawProps.data? rawProps.data : [
                    {
                        valueField: 'valueField',
                        displayField: 'displayField'
                    }
                ];
            }
        },
        configDropDown: {
            type: Object,
            default: function(rawProps)
            {
                return rawProps.configDropDown? rawProps.configDropDown: 
                {
                    height: 200,
                    arrowPositionX: 0,
                    arrowPositionY: 0,
                    directArrow: 'top',
                };
            }
        },
        haveBorder: {
            type: Boolean,
            default: true
        },
        data: 
        {
            type: Object,
            default: function(rawProps)
            {
                return rawProps.data? rawProps.data : [
                    {
                        valueField: 'value',
                        displayField: 'asdasddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd asd asd asd '
                    }
                ];
            }
        },
        
    },
    methods: 
    {
        selectItem(dataItem,index)
        {
            let me = this;
            me.indexItemSelected = index;
            me.$emit('update:modelValue',dataItem[me.configField.valueField]);
            me.isShowDropDown = false;
        },
        findPositionIcon()
        {
            let me = this;
            me.elementUseDropDown = me.$el.querySelector('.display-value-box');
            let postionInp = me.elementUseDropDown.getBoundingClientRect();
            me.configDropDown.positionXShow = postionInp.left + postionInp.width/2;
            me.configDropDown.positionYShow = postionInp.top + postionInp.height/2;
            me.configDropDown.arrowPositionX = me.configDropDown.arrowPositionX? me.configDropDown.arrowPositionX: 0;
            me.configDropDown.arrowPositionY = me.configDropDown.arrowPositionY? me.configDropDown.arrowPositionY: 0;
            me.configDropDown.width =  me.configDropDown.width? me.configDropDown.width : postionInp.width;
            me.configDropDown.height = me.configDropDown.height;
            me.configDropDown.directArrow = 'top';
            Object.assign(me.configInside, me.configDropDown);
            me.configInside = null;
            me.$nextTick(()=>{
                me.configInside = me.configDropDown;
            });
        },
        showDropDown(){
            let me = this;
            me.isShowDropDown = true;
        },
        hideDropDown()
        {
            let me = this;
            me.isShowDropDown = false;
            me.$emit('closeDropDownEvent');
        }
    },
    data()
    {
        return{
            elementUseDropDown: null,
            isShowDropDown: false,
            indexItemSelected: 0,
            configInside: {}
        }
    }
}
</script>

<style scoped>
@import url('../../assets/css/componentCommon/LocalCombobox.css');
</style>