import gitHubGraphQLAPI from 'node-github-graphql';
import axios from 'axios';
import dbService from './db-service';

let GITHUB_GRAPHQL_API;
let GITHUB_REST_API;
let API_TOKEN;
let USER_AGENT;

// sets up objects to use when making API calls using access token of the given dojo
async function setupApiWithAccess(dojoId) {
  // get the access token for this dojo
  API_TOKEN = (await dbService.query({
    text: 'SELECT github_access_token FROM github_integrations WHERE dojo_id=$1;',
    values: [dojoId],
  })).rows[0].github_access_token;
  
  // set up the object for v4 API calls
  GITHUB_GRAPHQL_API = new gitHubGraphQLAPI({
    token: API_TOKEN,
  });
  
  // get the user agent (username) for this user
  const userAgentResponse = await GITHUB_GRAPHQL_API.query(`
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
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
      'Authorization': `token ${API_TOKEN}`,
    }
  });
}

// posts given tmp code to GitHub and retrieves access token returned
async function getAccessToken(githubData) {
  const GITHUB_REST_API = axios.create({
    baseURL: 'https://github.com',
    timeout: 10000,
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
  const apiEndpoint = `/repos/${owner}/${commitData.repo}/contents/${commitData.path}`;
  let apiCommitData;
  
  // if the file already exists
  try {
    const fileResponse = await GITHUB_REST_API.get(apiEndpoint);
    // data to be used in the API call
    apiCommitData = {
      path: commitData.path,
      message: commitData.message,
      content: commitData.content,
      branch: commitData.branch,
      sha: fileResponse.data.sha,
    };
  } catch (e) {
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

// pushes a tree of files to a repo
async function pushTreeToRepo(treeData) {
  await setupApiWithAccess(treeData.dojoId);
  
  // get the owner of the repo
  const owner = GITHUB_REST_API.defaults.headers['User-Agent'];
  
  // endpoints to hit
  const apiBlobEndpoint = `/repos/${owner}/${treeData.repo}/git/blobs`;
  const apiTreeEndpoint = `/repos/${owner}/${treeData.repo}/git/trees`;
  const apiBranchEndpoint = `/repos/${owner}/${treeData.repo}/branches/${treeData.branch}`;
  const apiCommitEndpoint = `/repos/${owner}/${treeData.repo}/git/commits`;
  const apiMergeEndpoint = `/repos/${owner}/${treeData.repo}/merges`;
  
  // create blobs and tree array to send to GitHub API
  let tree = [];
  for (let i = 0; i < treeData.files.length; i++) {
    const file = treeData.files[i];
    const blob = await GITHUB_REST_API.post(apiBlobEndpoint, {
      content: file.content,
      encoding: 'base64',
    });
    tree.push({
      sha: blob.data.sha,
      path: file.path,
      mode: '100644',
      type: 'blob',
    });
  }
  
  // data to POST to tree endpoint
  const apiTreeData = {
    tree: tree,
  };
  
  // create the tree
  const treeResponse = await GITHUB_REST_API.post(apiTreeEndpoint, apiTreeData);
  
  // get current status of branch
  const branchResponse = await GITHUB_REST_API.get(apiBranchEndpoint);
  
  // data to POST to commit endpoint
  const apiCommitData = {
    message: 'Update',
    tree: treeResponse.data.sha,
    parents: [branchResponse.data.commit.sha],
  };
  
  // commit the tree
  const commitResponse = await GITHUB_REST_API.post(apiCommitEndpoint, apiCommitData);
  
  // data to POST to merge endpoint
  const apiMergeData = {
    base: treeData.branch,
    head: commitResponse.data.sha,
    commit_message: 'Merge update',
  };
  
  // merge the tree into the branch
  return GITHUB_REST_API.post(apiMergeEndpoint, apiMergeData);
}

// exported functions
module.exports = {
  getAccessToken: getAccessToken,
  createRepo: createRepo,
  commitFileToRepo: commitFileToRepo,
  pushTreeToRepo: pushTreeToRepo,
};