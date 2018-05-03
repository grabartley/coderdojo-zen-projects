import Vue from 'vue';

const userService = {
  // gets the data associated with a particular user
  getUserData: userId => Vue.http.get(`${Vue.config.apiServer}/api/2.0/profiles/load-user-profile/${userId}`),
  // checks if the user with the given id is a champion of the dojo with the given id
  isUserChampion: (userId, dojoId) => Vue.http.get(`${Vue.config.apiServer}/api/2.0/users/is-champion/${userId}/${dojoId}`),
  // checks if the user with the given id is a CDF Admin
  isUserCDFAdmin: (userId) => Vue.http.get(`${Vue.config.apiServer}/api/2.0/users/is-cdf-admin/${userId}`),
  // logs in with the given email and password
  login: loginData => Vue.http.post(`${Vue.config.apiServer}/api/2.0/users/login`, loginData),
};

export default userService;