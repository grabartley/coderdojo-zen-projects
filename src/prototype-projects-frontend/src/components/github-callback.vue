<template>
  <div class="github-callback">
  </div>
</template>
<script>
  import userService from '@/users/service';
  
  export default {
    name: 'GitHubCallback',
    data() {
      return {
        githubClientId: process.env.GITHUB_CLIENT_ID,
      };
    },
    computed: {
      callbackCode() {
        return this.$route.query.code;
      },
      loggedInUserId() {
        return this.$cookies.get('loggedIn');
      },
    },
    methods: {
      async getAccessToken() {
        const githubData = {
          client_id: this.githubClientId,
          code: this.callbackCode,
        };
        await userService.storeAccessToken(this.loggedInUserId, githubData);
      },
    },
    created() {
      this.getAccessToken();
    },
  }
</script>
<style scoped lang="less">
</style>