import gitHubGraphQLAPI from 'node-github-graphql';
import axios from 'axios';
import fs from 'file-system';

let GITHUB_GRAPHQL_API;
let GITHUB_REST_API;
let API_TOKEN;
let USER_AGENT;

// sets up objects to use when making API calls using access token of the given user
async function setupApiWithAccess(userId) {
  // get the access token for this user
  let allUsers = JSON.parse(fs.readFileSync('./users/users.json'));
  let currentUser = allUsers.users.find((user) => {
    return user.id === userId;
  });
  API_TOKEN = currentUser.githubAccessToken;
  
  // set up the object for v4 API calls
  GITHUB_GRAPHQL_API = new gitHubGraphQLAPI({
    token: API_TOKEN,
  });
  
  // get the user agent (username) for this user
  let userAgentResponse = await GITHUB_GRAPHQL_API.query(`
  {
      viewer {
        login
      }
  }
  `);
  USER_AGENT = userAgentResponse.data.viewer.login;
  
  // set up the object for v3 API calls
  GITHUB_REST_API = axios.create({
    baseURL: 'https://api.github.com',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
      'Authorization': 'token ' + API_TOKEN,
    }
  });
}

// posts given tmp code to GitHub and retrieves access token returned
async function getAccessToken(githubData) {
  const GITHUB_REST_API = axios.create({
    baseURL: 'https://github.com',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  let response = await GITHUB_REST_API.post('/login/oauth/access_token', githubData);
  return response.data;
}

// creates a repository for the given project data
async function createRepo(projectMetadata, userId) {
  await setupApiWithAccess(userId);
  
  // data to be used in the API call
  const repoData = {
    name: projectMetadata.id,
  };
  
  // make the call
  return GITHUB_REST_API.post('/user/repos', repoData).catch((err) => {
    console.log(err.message);
  });
}

// exported functions
module.exports = {
  getAccessToken: getAccessToken,
  createRepo: createRepo,
};