import DojoService from '@/dojos/service';
import Vue from 'vue';

describe('DojoService', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('getDojoById', () => {
    it('should return the dojo data for the given dojo id', async () => {
      // ARRANGE
      const dojoIdMock = '1234-5678';
      const dojoMock = {
        id: '1234-5678',
        name: 'My Local Dojo',
      };
      sandbox.stub(Vue.http, 'get').withArgs(`${Vue.config.apiServer}/api/2.0/dojos/${dojoIdMock}`).returns(Promise.resolve(dojoMock));
      
      // ACT
      const dojo = await DojoService.getDojoById(dojoIdMock);
      
      // ASSERT
      expect(dojo).to.equal(dojoMock);
    });
  });
  describe('getDojoByGitHubId', () => {
    it('should return the dojo data for the given GitHub integration id', async () => {
      // ARRANGE
      const githubIdMock = '5678-1234';
      const dojoMock = {
        id: '1234-5678',
        name: 'My Local Dojo',
      };
      sandbox.stub(Vue.http, 'get').withArgs(`${Vue.config.apiServer}/api/2.0/dojos/dojo-by-github-integration/${githubIdMock}`).returns(Promise.resolve(dojoMock));
      
      // ACT
      const dojo = await DojoService.getDojoByGitHubId(githubIdMock);
      
      // ASSERT
      expect(dojo).to.equal(dojoMock);
    });
  });
  describe('getUsersDojos', () => {
    it('should return the dojo ids of the Dojos the user has joined', async () => {
      // ARRANGE
      const userIdMock = '1234-5678';
      const usersDojosMock = ['5678-1234'];
      sandbox.stub(Vue.http, 'get').withArgs(`${Vue.config.apiServer}/api/2.0/dojos/dojos-for-user/${userIdMock}`).returns(Promise.resolve(usersDojosMock));
      
      // ACT
      const usersDojos = await DojoService.getUsersDojos(userIdMock);
      
      // ASSERT
      expect(usersDojos).to.equal(usersDojosMock);
    });
  });
});