<template>
  <div class="common-footer">
    <router-link :to="{ name: 'Acknowledgements', params: {} }">Acknowledgements</router-link>
  </div>
</template>
<script>
  export default {
    name: 'CommonFooter',
  }
</script>
<style scoped lang="less">
  .common-footer {
    padding: 10px;
    font-size: 0.85em;
    background-color: #d9d9d9;
    border-top: 2px solid #bfbfbf;
  }
</style>