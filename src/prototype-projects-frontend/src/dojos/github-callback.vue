<template>
  <div class="github-callback">
  </div>
</template>
<script>
  import dojoService from '@/dojos/service';
  
  export default {
    name: 'GitHubCallback',
    data() {
      return {
        githubClientId: process.env.GITHUB_CLIENT_ID,
      };
    },
    computed: {
      dojoId() {
        return this.$route.query.dojoId;
      },
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
        await dojoService.storeAccessToken(this.dojoId, this.loggedInUserId, githubData);
      },
    },
    async created() {
      await this.getAccessToken();
      this.$router.push(`/admin-panel/${this.dojoId}`);
    },
  }
</script>
<style scoped lang="less">
</style>