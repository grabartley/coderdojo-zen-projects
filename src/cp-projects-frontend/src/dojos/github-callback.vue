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
      // returns the Dojo id from the route query
      dojoId() {
        return this.$route.query.dojoId;
      },
      // returns the GitHub callback code from the route query
      callbackCode() {
        return this.$route.query.code;
      },
      // returns the id of the logged in user
      loggedInUserId() {
        return this.$cookie.get('loggedIn');
      },
    },
    methods: {
      // completes the GitHub integration for the given data
      async integrateGitHub() {
        const githubData = {
          client_id: this.githubClientId,
          code: this.callbackCode,
        };
        await dojoService.completeGitHubIntegration(this.dojoId, this.loggedInUserId, githubData);
      },
    },
    async created() {
      await this.integrateGitHub();
      this.$router.push(`/admin-panel/${this.dojoId}`);
    },
  }
</script>
<style scoped lang="less">
</style>