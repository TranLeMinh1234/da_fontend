<template>
    <IconDropDown
        :config="{
            width: 650,
            height: 100,
            arrowPositionX:200,
            directArrow: 'top',
        }"
        :iconClass="icon"
        :isShowDropDown="isShowListNotification"
        @showDropDownEvent="showListNotification"
        @closeDropDownEvent="closeListNotification"
    >
        asdasd
    </IconDropDown>
</template>

<script>
import IconDropDown from './IconDropDown.vue';
import BaseComponent from './BaseComponent.vue';

export default {
    name: 'Notification',
    extends: BaseComponent,
    components: {
        IconDropDown
    },
    props: {
        icon: {
            type: String,
            default: ""
        }
    },
    methods: {
        showListNotification()
        {
            let me = this;
            me.isShowListNotification= true;
        },
        closeListNotification()
        {
            let me = this;
            me.isShowListNotification = false;
        }
    },
    data()
    {
        return {
            isShowListNotification: false
        };
    }
}
</script>

<style scoped>

</style>