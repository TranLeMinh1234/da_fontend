<template>
  <DialogNotification :configModal="{
    width: 500,
    height: 500
  }" />
</template>

<script>
import DialogNotification from './components/commonComponent/DialogNotification.vue'
export default {
  name: 'App',
  components: {
    DialogNotification
  },
  created()
  {
    let me = this;
  },
  methods:{
    
  }
}
</script>

<style>
@import url('./assets/css/main.css');
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
