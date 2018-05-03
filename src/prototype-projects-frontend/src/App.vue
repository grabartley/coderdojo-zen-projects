<template>
  <div id="app">
    <common-header></common-header>
    <router-view :key="$route.fullPath"/>
    <common-footer></common-footer>
  </div>
</template>
<script>
  import commonHeader from '@/common/common-header';
  import commonFooter from '@/common/common-footer';

  export default {
    name: 'App',
    components: {
      commonHeader: commonHeader,
      commonFooter: commonFooter,
    },
  }
</script>
<style lang="less">
  @import "~bootstrap/less/bootstrap.less";

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    background-color: #FFFFFF;
    text-align: center;
    margin: 0 18%;
    font-size: 16px;
    line-height: normal;
  }
  input, textarea {
    padding: 8px 10px;
    font-size: 16px;
    color: #2c3e50;
    border-style: solid;
    border-radius: 2px;
    border-color: #99999F;
    border-width: 0.5px;
  }
  label {
    font-weight: normal;
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
      color: #FFFFFF;
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
  .pop-enter-active {
    animation: bounce-in .25s;
  }
  .pop-leave-active {
    animation: bounce-in .25s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
