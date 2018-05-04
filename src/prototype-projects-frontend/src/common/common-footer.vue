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
    padding: 20px;
    font-size: 12px;
    color: white;
    background-color: #303030;
    & a {
      color: white;
      text-decoration: none;
    }
  }
</style>