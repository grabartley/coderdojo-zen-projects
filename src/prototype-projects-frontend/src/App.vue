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

<style lang="less">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    text-align: center;
  }
  
  input, textarea {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  
  input:focus, textarea:focus, button:focus {
    outline: none;
  }

  .error-message {
    color: red;
  }
  
  .primary-button {
    padding: 10px;
    border: none;
    border-radius: 10px;
    color: white;
    font-weight: bold;
    background-color: #4da6ff;
    &:hover {
      cursor: pointer;
      background-color: #80bfff;
    }
  }
  
  .danger-button {
    padding: 10px;
    border: none;
    border-radius: 10px;
    color: white;
    font-weight: bold;
    background-color: red;
    &:hover {
      cursor: pointer;
      background-color: #ff5c33;
    }
  }
</style>
