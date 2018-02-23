<template>
  <div class="view-profile">
    <div class="view-profile__header">
      <router-link v-if="currentUser" :to="{ name: 'EditProfile', params: {userId: userData.id} }">Edit Profile</router-link>
    </div>
    <h2 v-if="userData">{{ userData.name }}</h2>
    <h3>Basic Information</h3>
    <div v-if="userData" class="view-profile__basic">
      Email: {{ userData.email }}
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
        currentUser: null,
      };
    },
    async created() {
      const userId = this.$route.params.userId;
      this.userData = await userService.getUserData(userId);
      this.userData = this.userData.body;
      
      const loggedInUserId = this.$cookies.get('loggedIn');
      if (this.userData.id === loggedInUserId) {
        this.currentUser = loggedInUserId;
      } 
    },
  }
</script>
<style scoped lang="less">
  .view-profile {
    &__header {
      margin-right: 50px;
      text-align: right;
    }
  }
</style>