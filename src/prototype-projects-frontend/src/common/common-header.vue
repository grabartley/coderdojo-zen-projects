<template>
  <div class="common-header">
    <router-link class="common-header__title" :to="{ name: 'ProjectList', params: {} }">
      <img src="@/assets/cd-logo.png" class="common-header__title-icon"></img>
      <span class="common-header__title-text">CoderDojo Zen</span>
    </router-link>
    <div class="common-header__login">
      <div v-if="loggedInUser" class="common-header__login-profile">
        <button class="common-header__login-profile-button" v-bind:class="{ 'common-header__login-profile-button--selected': profileDropdown }" @click="profileDropdown = !profileDropdown">
          {{ loggedInUser.name }}
        </button>
        <div class="common-header__login-profile-dropdown" v-bind:class="{ 'common-header__login-profile-dropdown--open': profileDropdown }">
          <button @click="myProfile" class="common-header__login-profile-dropdown-option">
            My Profile
          </button>
          <button @click="logout" class="common-header__login-profile-dropdown-option">
            Logout
          </button>
        </div>
      </div>
      <div v-else class="common-header__login-button">
        <router-link :to="{ name: 'Login', params: {} }">Login</router-link>
      </div>
    </div>
  </div>
</template>
<script>
  import userService from '@/users/service';

  export default {
    name: 'CommonHeader',
    data() {
      return {
        loggedInUser: null,
        profileDropdown: false,
      };
    },
    methods: {
      myProfile() {
        this.$router.push(`/view-profile/${this.loggedInUser.id}`);
        this.profileDropdown = false;
      },
      logout() {
        this.$cookies.remove('loggedIn');
        this.loggedInUser = null;
        this.profileDropdown = false;
      },
    },
    async created() {
      // get logged in user (if there is one)
      const userId = this.$cookies.get('loggedIn');
      if (userId) {
        this.loggedInUser = (await userService.getUserData(userId)).body;
      }
    },
  }
</script>
<style scoped lang="less">
  .common-header {
    display: flex;
    align-items: center;
    padding: 20px 0;
    background-color: #eee;
    &__title {
      display: flex;
      align-items: center;
      margin-left: 16px;
      text-decoration: none;
      color: #2c3e50;
      &:hover {
        color: #2c3e50;
      }
      &-icon {
        width: 45px;
        height: 45px;
      }
      &-text {
        margin-left: 12px;
        font-size: 24px;
        font-weight: 300;
      }
    }
    &__login {
      flex: 2;
      position: relative;
      &-profile {
        display: flex;
        flex-direction: column;
        position: absolute;
        right: 0;
        top: -20px;
        text-align: right;
        z-index: 1;
        &-button {
          padding: 15px 20px;
          min-width: 200px;
          color: #99999F;
          background-color: #eee;
          border: none;
          &:hover {
            text-decoration: none;
            color: #2c3e50;
          }
          &--selected {
            padding: 14px 19px;
            color: #2c3e50;
            background-color: #f2f2f2;
            border: solid 1px #99999F;
          }
        }
        &-dropdown {
          display: none;
          &--open {
            display: flex;
            flex-direction: column;
          }
          &-option {
            padding: 10px 20px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background-color: #f2f2f2;
            border: solid 1px #99999F;
            border-top: none;
            &:hover {
              padding-left: 13px;
              border-left: solid 8px #0093D5;
              transition: 0.3s;
            }
          }
        }
      }
      &-button {
        margin-right: 16px;
        text-align: right;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        & a {
          text-decoration: none;
          color: #2c3e50;
        }
      }
    }
  }
</style>