<template>
  <div class="common-header">
    <div class="common-header__project-list">
      <router-link :to="{ name: 'ProjectList', params: {} }">Project List</router-link>
    </div>
    <div class="common-header__title">
      CoderDojo Zen
    </div>
    <div class="common-header__login">
      <button @click="logout" v-if="loggedIn">Logout</button>
      <router-link v-else :to="{ name: 'Login', params: {} }">Login</router-link>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'CommonHeader',
    data() {
      return {
        loggedIn: false,
      };
    },
    methods: {
      logout() {
        this.$cookies.remove('loggedIn');
        this.loggedIn = false;
      },
    },
    created() {
      // check if logged in
      this.loggedIn = this.$cookies.get('loggedIn');
    },
  }
</script>
<style scoped lang="less">
  .common-header {
    display: flex;
    padding: 20px;
    background-color: #eee;
    &__project-list {
      flex: 2;
      margin-left: 50px;
      text-align: left;
    }
    &__title {
      font-size: 24px;
      font-weight: bold;
    }
    &__login {
      flex: 2;
      margin-right: 50px;
      text-align: right;
    }
  }
  button, a {
    border: none;
    text-decoration: none;
    color: #99999F;
    background-color: #eee;
    font-size: 16px;
    &:hover {
      cursor: pointer;
      color: #73449B;
    }
  }
</style>