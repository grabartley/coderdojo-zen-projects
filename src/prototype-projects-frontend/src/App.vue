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
    background-color: white;
    text-align: center;
    margin: 0 18%;
  }
  input, textarea {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: 5px 10px;
    color: #2c3e50;
    border-style: solid;
    border-radius: 2px;
    border-color: #99999F;
    border-width: 0.5px;
  }
  button:focus {
    outline: none;
  }
  .error-message {
    color: red;
    font-size: 14px;
    font-style: italic;
  }
  .primary-button {
    padding: 10px 15px;
    font-size: 18px;
    border: solid 1px #008bcc;
    border-radius: 5px;
    color: white;
    background-color: #0093D5;
    &:hover {
      cursor: pointer;
      background-color: #00aeff;
    }
  }
  .danger-button {
    padding: 10px 15px;
    font-size: 18px;
    border: none;
    border-radius: 5px;
    color: white;
    background-color: red;
    &:hover {
      cursor: pointer;
      background-color: #ff5c33;
    }
  }
</style>
