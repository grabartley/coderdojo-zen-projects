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
        dojoId: '1234-5678',
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
                    statusCode: '200',
                  });
                } else {
                  return Promise.resolve({
                    statusCode: '404',
                  });
                }
              },
            };
          },
        },
        './db-service': {
          query: async (queryString) => {
            if (queryString === 'SELECT github_access_token FROM github_integrations WHERE dojo_id=\'' + repoDataMock.dojoId + '\';') {
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
    it('should push a commit to a repository to create a new file', async () => {
      // ARRANGE
      const ownerMock = 'championone';
      const commitDataMock = {
        repo: '5678-1234',
        path: 'TestProject.zip',
        message: 'Initial commit',
        content: 'fileData',
        branch: 'master',
        dojoId: '1234-5678'
      };
      const expectedApiEndpoint = '/repos/' + ownerMock + '/' + commitDataMock.repo + '/contents/' + commitDataMock.path;
      const expectedApiCommitData = {
        path: commitDataMock.path,
        message: commitDataMock.message,
        content: commitDataMock.content,
        branch: commitDataMock.branch,
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
              defaults: {
                headers: {
                  'User-Agent': ownerMock,
                },
              },
              get: (route) => {
                if (route === expectedApiEndpoint) {
                  throw {
                    message: 'error',
                  };
                } else {
                  return Promise.resolve();
                }
              },
              put: (route, data) => {
                if (route === expectedApiEndpoint && JSON.stringify(data) === JSON.stringify(expectedApiCommitData)) {
                  return Promise.resolve({
                    statusCode: '200',
                  });
                } else {
                  return Promise.resolve({
                    statusCode: '404',
                  });
                }
              },
            };
          },
        },
        './db-service': {
          query: async (queryString) => {
            if (queryString === 'SELECT github_access_token FROM github_integrations WHERE dojo_id=\'' + commitDataMock.dojoId + '\';') {
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
    it('should push a commit to a repository to update an existing file', async () => {
      // ARRANGE
      const ownerMock = 'championone';
      const shaMock = '5678-4321';
      const commitDataMock = {
        repo: '5678-1234',
        path: 'TestProject.zip',
        message: 'Initial commit',
        content: 'fileData',
        branch: 'master',
        dojoId: '1234-5678'
      };
      const expectedApiEndpoint = '/repos/' + ownerMock + '/' + commitDataMock.repo + '/contents/' + commitDataMock.path;
      const expectedApiCommitData = {
        path: commitDataMock.path,
        message: commitDataMock.message,
        content: commitDataMock.content,
        branch: commitDataMock.branch,
        sha: shaMock
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
              defaults: {
                headers: {
                  'User-Agent': ownerMock,
                },
              },
              get: (route) => {
                if (route === expectedApiEndpoint) {
                  return Promise.resolve({
                    data: {
                      sha: shaMock,
                    }
                  });
                } else {
                  return Promise.resolve();
                }
              },
              put: (route, data) => {
                if (route === expectedApiEndpoint && JSON.stringify(data) === JSON.stringify(expectedApiCommitData)) {
                  return Promise.resolve({
                    statusCode: '200',
                  });
                } else {
                  return Promise.resolve({
                    statusCode: '404',
                  });
                }
              },
            };
          },
        },
        './db-service': {
          query: async (queryString) => {
            if (queryString === 'SELECT github_access_token FROM github_integrations WHERE dojo_id=\'' + commitDataMock.dojoId + '\';') {
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
  describe('pushTreeToRepo', () => {
    it('should push the given tree data as a tree of files to the repo', async () => {
      // ARRANGE
      const treeDataMock = {
        repo: '1234-5678',
        dojoId: '5678-1234',
        files: [
          {
            path: 'test.py',
            content: 'testContent',
          },
          {
            path: 'helper.py',
            content: 'helperContent',
          },
          {
            path: 'subFolder/anotherHelper.py',
            content: 'anotherHelperContent',
          },
        ],
      };
      const ownerMock = 'championone';
      const expectedApiBlobEndpoint = '/repos/championone/1234-5678/git/blobs';
      const expectedApiTreeEndpoint = '/repos/championone/1234-5678/git/trees';
      const expectedApiBranchEndpoint = '/repos/championone/1234-5678/branches/master';
      const expectedApiCommitEndpoint = '/repos/championone/1234-5678/git/commits';
      const expectedApiMergeEndpoint = '/repos/championone/1234-5678/merges';
      const expectedApiMergeData = {
        base: 'master',
        head: '4321-8765',
        commit_message: 'update',
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
              defaults: {
                headers: {
                  'User-Agent': ownerMock,
                },
              },
              get: (route) => {
                if (route === expectedApiBranchEndpoint) {
                  return Promise.resolve({
                    data: {
                      commit: {
                        sha: '8765-1234'
                      }
                    }
                  });
                }
              },
              post: (route, data) => {
                if (route === expectedApiBlobEndpoint) {
                  return Promise.resolve({
                    data: {
                      sha: '8765-1234',
                    }
                  });
                } else if (route === expectedApiTreeEndpoint) {
                  return Promise.resolve({
                    data: {
                      sha: '8765-1234',
                    }
                  });
                } else if (route === expectedApiCommitEndpoint) {
                  return Promise.resolve({
                    data: {
                      sha: '4321-8765',
                    }
                  });
                } else if (route === expectedApiMergeEndpoint && JSON.stringify(data) === JSON.stringify(expectedApiMergeData)) {
                  return Promise.resolve({
                    statusCode: '200',
                  });
                } else {
                  return Promise.resolve({
                    statusCode: '404',
                  });
                }
              },
            };
          },
        },
        './db-service': {
          query: async (queryString) => {
            if (queryString === 'SELECT github_access_token FROM github_integrations WHERE dojo_id=\'' + treeDataMock.dojoId + '\';') {
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
      const response = await GitHubServiceMock.pushTreeToRepo(treeDataMock);
      
      // ASSERT
      expect(response.statusCode).to.equal('200');
    }).timeout(10000);
  });
});