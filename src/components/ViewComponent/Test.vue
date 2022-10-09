<template>
    <BaseForm ref="form">
        <MInput v-model="data1" ref="child" rule="required" nameField="Tai khoan"/>
    </BaseForm>
    <button @click="validate()">asdasd</button>
</template>

<script>
import IconDropDown from '../commonComponent/IconDropDown.vue';
import BaseForm from '../commonComponent/BaseForm.vue';
import MInput from '../commonComponent/MInput.vue';
export default {
    name:"Test",
    components: 
    {
        IconDropDown,
        MInput,
        BaseForm
    },
    created(){
        let me = this;
    },
    mounted(){
        let me = this;
    },
    computed:
    {
        
    },
    methods: {
        validate()
        {
            let me = this;
            console.log(me.$refs.form.validate());
        }
    },
    data()
    {
        return {
            data1: ''
        }
    }
}
</script>

<style scoped>
#Test
{
    width: 100%;
    height: 100%;
    background: black;
}
</style>