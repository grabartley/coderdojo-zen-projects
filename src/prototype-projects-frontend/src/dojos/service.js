import Vue from 'vue';

const dojoService = {
  // returns the dojo data for a given dojo id
  getDojoById: dojoId => Vue.http.get(`${Vue.config.apiServer}/api/2.0/dojos/${dojoId}`),
  // returns the dojo ids for the dojos the user with the given userId has joined
  getUsersDojos: userId => Vue.http.get(`${Vue.config.apiServer}/api/2.0/dojos/dojos-for-user/${userId}`),
};

export default dojoService;