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
    background-color: #FFFFFF;
    text-align: center;
    margin: 0 18%;
  }
  input, textarea {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: 8px 10px;
    font-size: 16px;
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
    color: #9B1C20;
    font-size: 14px;
    font-style: italic;
  }
  .primary-button, .danger-button {
    padding: 10px 15px;
    width: 160px;
    height: 40px;
    font-size: 18px;
    border-radius: 5px;
    color: #FFFFFF;
    &:hover {
      cursor: pointer;
    }
  }
  .primary-button {
    border: solid 1px #008bcc;
    background-color: #0093D5;
    &:hover {
      background-color: #00aeff;
    }
  }
  .danger-button {
    border: solid 1px #9B1C20;
    background-color: #9B1C20;
    &:hover {
      background-color: #d7282d;
    }
  }
</style>
