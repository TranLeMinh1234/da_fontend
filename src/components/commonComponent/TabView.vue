<template>
    <div class="tab-view-background">
        <div class="header">
            <div class="tab-container d-flex al-center">
                <div 
                    v-for="(tab, index) in tabs" :key="index"
                    :class="['tab','d-flex','center-items','c-poiter',indexCurrentTabActive == index ? 'tab-active' : '']"
                    @click="indexCurrentTabActive = index"
                >
                    <div class="tab-title">{{tab.title}}</div>
                </div>
            </div>
        </div>
        <div class="body">
            <div 
                v-for="(tab, index) in tabs" :key="index"
                :class="['tab-content',indexCurrentTabActive == index ? '':'d-none']" 
            >
                <slot :name="'tab'+(index+1)"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import BaseComponent from './BaseComponent.vue';

export default {
    name: 'TabView',
    extends: BaseComponent,
    props: {
        tabs: {
            type: Array,
            default: function(rawProps){
                return rawProps.tabs ? rawProps.tabs : [];
            }
        }
    },
    data()
    {
        return {
            indexCurrentTabActive: 0
        };
    }
}
</script>

<style scoped>
@import url('../../assets/css/componentCommon/TabView.css');
</style>