<template>
    
</template>

<script>
import {validateRule} from '../../common/js/validateRule.js';

export default {
    // extend component này thì khai báo data 
    // isValid, valueValidate-value chính của component
    name: 'BaseDataControl',
    created(){
        let me = this;
    },
    props: {
        rule: {
            type: String, 
            default: ""
        },
        modelValue: {
            type: String,
            default: ""
        },
        nameField: {
            type: String,
            default: ''
        }
    },
    methods:
    {
      getInfoValidate()
      {
        let me = this;
        return {
            element: null,
            isValid: me.isValid,
            valueValidate: me.valueValidate,
            errorCode: [],
            nameField: me.nameField,
            rule: me.rule
        };
      },
      validateSelf()
      {
        let me = this;
        let resultValidate = validateRule.validate(me.getInfoValidate());
        if(!(resultValidate && resultValidate.isValid))
        {
            me.isValid = false;
            me.messNotiError = resultValidate?.messNotiError ? resultValidate.messNotiError : '';
        }
        else
        {
            me.isValid = true;
            me.messNotiError = ' ';
        }
        return resultValidate;
      } 
    },
    data()
    {
        return {
            isValid: true,
            valueValidate: null,
        }
    }
}
</script>

<style scoped>

</style>