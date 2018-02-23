<template>
  <div v-if="userData" class="edit-profile">
    <h2>{{ userData.name }}</h2>
    <a :href="githubAuthUrl" target="_blank">Authorize GitHub</a>
  </div>
</template>
<script>
  import userService from '@/users/service';

  export default {
    name: 'EditProfile',
    data() {
      return {
        userData: null,
        githubClientId: process.env.GITHUB_CLIENT_ID,
      };
    },
    computed: {
      githubAuthUrl() {
        return `https://github.com/login/oauth/authorize?scope=public_repo&client_id=${this.githubClientId}`;
      },
    },
    async created() {
      let userId = this.$route.params.userId;
      this.userData = await userService.getUserData(userId);
      this.userData = this.userData.body;
    },
  }
</script>
<style scoped lang="less"></style>