<template>
  <div class="login">
    <div class="login__title">
      <label>Log in to Zen</label>
    </div>
    <div class="login__form">
      <div class="login__form-input">
        <input class="login__form-input-field" v-model="email" v-validate.initial="'required|email'" name="email" type="email" placeholder="Email"></input>
        <div class="login__form-error error-message" v-show="isFormValidated && errors.has('email')">{{ errors.first('email') }}</div>
      </div>
      <div class="login__form-input">
        <input class="login__form-input-field" v-model="password" v-validate.initial="'required'" name="password" type="password" placeholder="Password"></input>
        <div class="login__form-error error-message" v-show="isFormValidated && errors.has('password')">{{ errors.first('password') }}</div>
      </div>
      <button class="login__form-button primary-button" @click="login()">Login</button>
      <div class="login__form-error error-message" v-show="loginFailed">Login was unsuccessful</div>
    </div>
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
  .login {
    &__title {
      margin: 30px 0;
      font-size: 24px;
    }
    &__form {
      &-input {
        margin: 20px 0;
        &-field {
          width: 500px;
        }
      }
      &-button {
        margin: 30px 0;
      }
      &-error {
        margin: 10px 0;
      }
    }
  }
</style>