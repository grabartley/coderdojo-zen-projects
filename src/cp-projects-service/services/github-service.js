import gitHubGraphQLAPI from 'node-github-graphql';
import axios from 'axios';

// take API token from environment variables for testing
const API_TOKEN = process.env.GITHUB_API_TOKEN;
// set up GitHub v4 GraphQL API to query with authorization using node-github-graphql
const GITHUB_GRAPHQL_API = new gitHubGraphQLAPI({
  token: API_TOKEN,
});
// set up GitHub v3 REST API to query with authorization using axios
// authenticating using a test account "grahambartley" until OAuth in place
let GITHUB_REST_API = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'grahambartley',
    'Authorization': 'token ' + API_TOKEN,
  }
});

// creates a repository named "test-repo-3" on the authorized account for testing
function createRepo() {
  const data = {
    name: 'test-repo-3',
  };
  return GITHUB_REST_API.post('/user/repos', data).catch((err) => {
    console.log(err.message);
  });
}

// exported functions
module.exports = {
  createRepo: createRepo,
};