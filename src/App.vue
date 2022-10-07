<template>
  <router-view></router-view>
</template>

<script>
import BaseComponent from './components/commonComponent/BaseComponent.vue';
import Home from './components/ViewComponent/Home.vue';
import Test from './components/ViewComponent/Test.vue';
export default {
  name: 'App',
  extends: BaseComponent,
  components: {
    Home,
    Test
  },
  created()
  {
    let me = this;
  },
  methods:{
    tlminh()
    {
      let me = this;
    }
  }
}
</script>

<style>
@import url('./assets/css/main.css');

</style>
