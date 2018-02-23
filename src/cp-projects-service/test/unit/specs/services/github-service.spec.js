import proxyquire from 'proxyquire';
import chai from 'chai';
const expect = chai.expect;

describe('GitHubService', () => {
  describe('createRepo', () => {
    it('should create a repository for the given project data', async () => {
      // ARRANGE
      const projectMetadataMock = {
        id: '5678-1234',
        name: 'Test Project',
        type: 'python',
        main: 'test.py',
        description: 'A test project.',
        dojoId: '',
        createdAt: '',
        userId: '1234-5678',
      };
      const userIdMock = '1234-5678';
      const repoDataMock = {
        name: '5678-1234',
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
                if (route === '/user/repos' && JSON.stringify(data) === JSON.stringify(repoDataMock)) {
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
            if (queryString === 'SELECT github_access_token FROM github_integrations WHERE user_id=\'' + userIdMock + '\';') {
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
      const response = await GitHubServiceMock.createRepo(projectMetadataMock, userIdMock);
      
      // ASSERT
      expect(response.statusCode).to.equal('200');
    }).timeout(10000);
  });
  
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
});