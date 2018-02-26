import gitHubGraphQLAPI from 'node-github-graphql';
import axios from 'axios';
import dbService from './db-service';

let GITHUB_GRAPHQL_API;
let GITHUB_REST_API;
let API_TOKEN;
let USER_AGENT;

// sets up objects to use when making API calls using access token of the given user
async function setupApiWithAccess(dojoId) {
  // get the access token for this user
  const tokenResponse = await dbService.query('SELECT github_access_token FROM github_integrations WHERE dojo_id=\'' + dojoId + '\';');
  API_TOKEN = tokenResponse.rows[0].github_access_token;
  
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
async function createRepo(repoData) {
  await setupApiWithAccess(repoData.dojoId);
  
  // data to be used in the API call
  const apiRepoData = {
    name: repoData.id,
    description: repoData.description,
  };
  
  // make the call
  return GITHUB_REST_API.post('/user/repos', apiRepoData);
}

// pushes a commit to a repository based on given commit data
async function commitFileToRepo(commitData) {
  await setupApiWithAccess(commitData.dojoId);
  // get the owner of the repo
  const owner = GITHUB_REST_API.defaults.headers['User-Agent'];
  
  // endpoint to hit
  const apiEndpoint = '/repos/' + owner + '/' + commitData.repo + '/contents/' + commitData.path;
  let apiCommitData;
  
  // if the file already exists
  const fileResponse = await GITHUB_REST_API.get(apiEndpoint);
  if (fileResponse.data.sha) {
    // get sha of the file being updated
    const sha = fileResponse.data.sha;
    // data to be used in the API call
    apiCommitData = {
      path: commitData.path,
      message: commitData.message,
      content: commitData.content,
      branch: commitData.branch,
      sha: sha,
    };
  } else {
    // data to be used in the API call
    apiCommitData = {
      path: commitData.path,
      message: commitData.message,
      content: commitData.content,
      branch: commitData.branch,
    };
  }
  
  return GITHUB_REST_API.put(apiEndpoint, apiCommitData);
}

// exported functions
module.exports = {
  getAccessToken: getAccessToken,
  createRepo: createRepo,
  commitFileToRepo: commitFileToRepo,
};