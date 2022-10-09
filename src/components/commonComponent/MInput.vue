<template>
    <div style="margin: 44px 44px 44px 44px" class="m-input">
        <div>
            <input 
                :type="type" 
                v-on="listeners" 
                ref="mInputElement" 
                v-model="valueValidate"
                :placeholder="placeholder"
                :title="title"
                :class="[isValid? '':'error']"
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
                    me.$emit('update:',me.valueValidate);
                    me.validateSelf();
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