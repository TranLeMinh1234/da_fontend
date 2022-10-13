<template>
    <div ref="baseFromObserve">
        <slot></slot>
    </div>
</template>

<script>
import BaseComponent from './BaseComponent.vue';

export default {
    name: 'BaseForm',
    extends: BaseComponent,
    created(){
        let me = this;
    },
    methods: {
        validate()
        {
            let me = this;
            me.loader = me.$loading.show();
            let isValid = me.validateForm() && me.validateBusiness();
            me.loader.hide();
            return isValid;
        },
        validateForm(){
            let me = this;
            let result = true;

            let lstComponent = [];
            for(var childComponentRef in me.$refsSlot)
            {
                if(childComponentRef.includes('inp'))
                    lstComponent.push(me.$refsSlot[childComponentRef]);
            }
            let errorList = [];
            for(let i = 0; i < lstComponent.length; i++)
            {
                let component = lstComponent[i];
                if(component)
                {
                    let resultValidate = component.validateSelf();
                    if(!resultValidate.isValid)
                    {
                        errorList.push(resultValidate);
                    }
                }
            }

            if(errorList.length > 0)
            {
                errorList[0].element?.focus();
                result = false;
            }

            return result;
        },
        validateBusiness()
        {
            let me = this;
            let result = true;

            return result;
        }
    }
}
</script>

<style scoped>

</style>