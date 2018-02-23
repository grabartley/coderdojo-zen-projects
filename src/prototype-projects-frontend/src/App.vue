<template>
  <div id="app">
    <common-header></common-header>
    <router-view/>
    <common-footer></common-footer>
  </div>
</template>

<script>
  import commonHeader from '@/components/common-header';
  import commonFooter from '@/components/common-footer';

  export default {
    name: 'App',
    components: {
      commonHeader: commonHeader,
      commonFooter: commonFooter,
    },
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    text-align: center;
  }

  .error-message {
    color: red;
  }
</style>
