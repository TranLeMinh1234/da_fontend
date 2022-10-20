<template>
  <router-view></router-view>
  <div id="dialogBind" class="d-none"></div>
</template>

<script>
import Home from './components/ViewComponent/Home.vue';
import Test from './components/ViewComponent/Test.vue';
export default {
  name: 'App',
  components: () =>
    {
        let me = this;
        return {
            Home,
            Test,
        };
    },
  created()
  {
    let me = this;
  },
  mounted() {
    
  },
  methods:{
    
  },
  data() {
    return {
      isShowDetail: false,
      configModal: null,
      props: null,
      componentParent: null
    }
  },
}
</script>

<style>
@import url('./assets/css/main.css');

</style>
