<template>
  <div class="not-found">
    <div class="not-found__message">
      <router-link :to="{ name: 'ProjectList', params: {} }" class="not-found__message-icon fas fa-map-signs"></router-link>
      <div class="not-found__message-text">
        <strong><div>This page couldn't be found!</div></strong>
        <div>Use the signpost to return to the project list.</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'NotFound',
  }
</script>
<style scoped lang="less">
  .not-found {
    &__message {
      display: inline-flex;
      align-items: center;
      margin: 90px 16px;
      &-icon {
        margin-right: 48px;
        font-size: 72px;
        text-decoration: none;
        color: #994d00;
      }
      &-text {
        font-size: 24px;
      }
    }
  }
</style>