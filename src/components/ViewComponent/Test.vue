<template>
    <div id="Test">
        <IconDropDown 
            :config="{
                width: 300,
                height: 400,
                directArrow: 'left'
            }"
            iconClass="app-icon"
        />
    </div>
</template>

<script>
import IconDropDown from '../commonComponent/IconDropDown.vue';
export default {
    name:"Test",
    components: 
    {
        IconDropDown
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
        
    },
    data()
    {
        return {
            
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