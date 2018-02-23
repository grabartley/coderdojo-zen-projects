import proxyquire from 'proxyquire';
import chai from 'chai';
const expect = chai.expect;

describe('GitHubService', () => {
  describe('getAccessToken', () => {
    it('should post given tmp code to GitHub and retrieve access token returned', async () => {
      // ARRANGE
      const githubDataMock = {
        client_id: '1234-5678',
        code: '5678-1234',
      };
      const dependencyMocks = {
        'axios': {
          create: (config) => {
            return {
              post: (route, data) => {
                return Promise.resolve({
                  data: 'accessTokenData',
                });
              },
            };
          },
        },
      };
      const GitHubServiceMock = proxyquire('../../../../src/services/github-service', dependencyMocks);
      
      // ACT
      const accessToken = await GitHubServiceMock.getAccessToken(githubDataMock);
      
      // ASSERT
      expect(accessToken).to.equal('accessTokenData');
    }).timeout(10000);
  });
  describe('createRepo', () => {
    it('should create a repository for the given project data', async () => {
      // ARRANGE
      const repoDataMock = {
        id: '5678-1234',
        description: 'A test project.',
        userId: '1234-5678',
      };
      const apiRepoDataMock = {
        name: '5678-1234',
        description: 'A test project.',
      };
      const dependencyMocks = {
        'node-github-graphql': () => {
          return {
            query: async (graphQlQuery) => {
              return Promise.resolve({
                data: {
                  viewer: {
                    login: 'championone',
                  },
                },
              });
            },
          };
        },
        'axios': {
          create: (config) => {
            return {
              post: (route, data) => {
                if (route === '/user/repos' && JSON.stringify(data) === JSON.stringify(apiRepoDataMock)) {
                  return Promise.resolve({
                    catch: () => null,
                    statusCode: '200',
                  });
                } else {
                  return Promise.resolve({
                    catch: () => null,
                    statusCode: '404',
                  });
                }
              },
            };
          },
        },
        './db-service': {
          query: async (queryString) => {
            if (queryString === 'SELECT github_access_token FROM github_integrations WHERE user_id=\'' + repoDataMock.userId + '\';') {
              return Promise.resolve({
                rows: [
                  {
                    github_access_token: '8765-4321',
                  },
                ],
              });
            }
          },
        },
      };
      const GitHubServiceMock = proxyquire('../../../../src/services/github-service', dependencyMocks);
      
      // ACT
      const response = await GitHubServiceMock.createRepo(repoDataMock);
      
      // ASSERT
      expect(response.statusCode).to.equal('200');
    }).timeout(10000);
  });
  describe('commitFileToRepo', () => {
    it('should push a commit to a repository based on given commit data', async () => {
      // ARRANGE
      const commitDataMock = {
        owner: 'championone',
        repo: '5678-1234',
        path: 'TestProject.zip',
        message: 'Initial commit',
        content: 'fileData',
        branch: 'master',
        userId: '1234-5678'
      };
      const apiEndpointMock = '/repos/' + commitDataMock.owner + '/' + commitDataMock.repo + '/contents/' + commitDataMock.path;
      const apiCommitData = {
        path: commitDataMock.path,
        message: commitDataMock.message,
        content: commitDataMock.content,
        branch: commitDataMock.branch
      };
      const dependencyMocks = {
        'node-github-graphql': () => {
          return {
            query: async (graphQlQuery) => {
              return Promise.resolve({
                data: {
                  viewer: {
                    login: 'championone',
                  },
                },
              });
            },
          };
        },
        'axios': {
          create: (config) => {
            return {
              put: (route, data) => {
                if (route === apiEndpointMock && JSON.stringify(data) === JSON.stringify(apiCommitData)) {
                  return Promise.resolve({
                    catch: () => null,
                    statusCode: '200',
                  });
                } else {
                  return Promise.resolve({
                    catch: () => null,
                    statusCode: '404',
                  });
                }
              },
            };
          },
        },
        './db-service': {
          query: async (queryString) => {
            if (queryString === 'SELECT github_access_token FROM github_integrations WHERE user_id=\'' + commitDataMock.userId + '\';') {
              return Promise.resolve({
                rows: [
                  {
                    github_access_token: '8765-4321',
                  },
                ],
              });
            }
          },
        },
      };
      const GitHubServiceMock = proxyquire('../../../../src/services/github-service', dependencyMocks);
      
      // ACT
      const response = await GitHubServiceMock.commitFileToRepo(commitDataMock);
      
      // ASSERT
      expect(response.statusCode).to.equal('200');
    }).timeout(10000);
  });
});