import Vue from 'vue';

const dojoService = {
  // returns the dojo data for a given dojo id
  getDojoById: dojoId => Vue.http.get(`${Vue.config.apiServer}/api/2.0/dojos/${dojoId}`),
  // returns the dojos the user with the given userId has joined
  getUsersDojos: userId => Vue.http.get(`${Vue.config.apiServer}/api/2.0/dojos/dojos-for-user/${userId}`),
  // returns the dojos the user with the given userId has joined which have a GitHub integration
  getUsersDojosWithGitHub: userId => Vue.http.get(`${Vue.config.apiServer}/api/2.0/dojos/dojos-for-user-with-github/${userId}`),
  // returns the dojo data for a given GitHub integration id
  getDojoByGitHubId: githubId => Vue.http.get(`${Vue.config.apiServer}/api/2.0/dojos/dojo-by-github-integration/${githubId}`),
  // returns true if the dojo with the given id has a GitHub integration
  isGitHubIntegrated: dojoId => Vue.http.get(`${Vue.config.apiServer}/api/2.0/dojos/is-github-integrated/${dojoId}`),
  // completes GitHub integration for dojo with dojoId and user with userId
  storeAccessToken: (dojoId, userId, githubData) => Vue.http.post(`${Vue.config.apiServer}/api/2.0/dojos/${dojoId}/${userId}/integrations/github`, githubData),
};

export default dojoService;