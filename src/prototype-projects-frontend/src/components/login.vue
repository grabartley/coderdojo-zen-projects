<template>
  <div class="login">
    <input class="login-email" v-model="email" v-validate.initial="'required|email'" name="email" type="email"></input>
    <div class="error-message" v-show="isFormValidated && errors.has('email')">{{ errors.first('email') }}</div>
    <input class="login-password" v-model="password" v-validate.initial="'required'" name="password" type="password"></input>
    <div class="error-message" v-show="isFormValidated && errors.has('password')">{{ errors.first('password') }}</div>
    <button @click="login()">Login</button>
    <div class="error-message" v-show="loginFailed">Login was unsuccessful</div>
  </div>
</template>
<script>
  import userService from '@/users/service';

  export default {
    name: 'Login',
    data() {
      return {
        email: null,
        password: null,
        isFormValidated: false,
        loginFailed: false,
      };
    },
    methods: {
      // check were all form fields validated
      isValid() {
        this.isFormValidated = true;
        return !this.errors.any();
      },
      // if all fields are valid, make the API call to login the user and if successful, give them a login cookie to emulate login and redirect them
      async login() {
        if (this.isValid()) {
          let loginData = {
            email: this.email,
            password: this.password,
          };
          let response = await userService.login(loginData);
          if (response.body) {
            this.loginFailed = false;
            this.$cookies.set('loggedIn', response.body.id);
            this.$router.push(`/view-profile/${response.body.id}`);
          } else {
            this.loginFailed = true;
          }
        }
      },
    },
  }
</script>
<style scoped lang="less">
</style>