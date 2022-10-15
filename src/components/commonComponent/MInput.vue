<template>
    <div class="m-input">
        <div class="background-input">
            <div v-if="isHaveIcon" :class="['file-icon',icon]"></div>
            <input 
                :type="type" 
                v-on="listeners" 
                ref="mInputElement" 
                v-model="valueValidate"
                :placeholder="placeholder"
                :title="title"
                :class="[isValid? '':'error']"
                :style="{
                    padding: padding
                }"
            >
        </div>
        <div class="cl-red txt-italic fz-12 pd-t-2 fit-content">{{messNotiError}}</div>
    </div>
</template>

<script>
import BaseDataControl from './BaseDataControl.vue';
import {validateRule} from '../../common/js/validateRule.js';
export default {
    name: "MInput",
    extends: BaseDataControl,
    props:{
        icon: {
            type: String,
            default: ''
        },
        isHaveIcon:{
            type: Boolean,
            default: false
        },
        padding:{
            type: String,
            default: '14px 14px 14px 14px'
        },
        type: {
            type: String,
            default: 'text'
        },
        placeholder: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        }
    },
    created()
    {
        let me = this;
    },
    computed:
    {
        listeners()
        {
            let me = this;
            return {
                input: function(event)
                {
                    me.valueValidate = event.target.value;
                    me.$emit('update:modelValue',me.valueValidate);
                    me.validateSelf();
                },
                keyup: function(event)
                {
                    switch(event.code){
                        case 'Enter':
                        case 'NumpadEnter':
                            me.$emit('enterEvent');
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    },
    methods: {
        getInfoValidate()
        {
            let me = this;
            return {
                element: me.$refs.mInputElement,
                isValid: me.isValid,
                valueValidate: me.valueValidate,
                nameField: me.nameField,
                errorCode: [],
                rule: me.rule
            };
        }
    },
    data()
    {
        let me = this;
        return {
            isValid: true,
            valueValidate: me.modelValue,
            messNotiError: ' '
        }
    }
}
</script>

<style scoped>
@import url('../../assets/css/componentCommon/MInput.css');
</style>