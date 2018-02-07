import Vue from 'vue';

const userService = {
  // logs in with the given email and password
  login: loginData => Vue.http.post(`${Vue.config.apiServer}/api/2.0/users/login`, loginData),
  // gets the data associated with a particular user
  getUserData: userId => Vue.http.get(`${Vue.config.apiServer}/api/2.0/profiles/load-user-profile/${userId}`),
};

export default userService;