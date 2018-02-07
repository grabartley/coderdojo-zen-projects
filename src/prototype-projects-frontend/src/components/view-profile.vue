<template>
  <div class="view-profile">
    <div v-if="userData" class="view-profile-basic">
      Name: {{ userData.name }}<br>
      Email: {{ userData.email }}
    </div>
    <div v-if="userData" class="view-profile-integration">
      GitHub: {{ isGitHubLinked }}
    </div>
  </div>
</template>
<script>
  import userService from '@/users/service';

  export default {
    name: 'ViewProfile',
    data() {
      return {
        userData: null,
      };
    },
    computed: {
      isGitHubLinked() {
        return !!this.userData.githubOauth;
      },
    },
    async created() {
      let userId = this.$route.params.userId;
      this.userData = await userService.getUserData(userId);
      this.userData = this.userData.body;
    },
  }
</script>
<style scoped lang="less">
</style>