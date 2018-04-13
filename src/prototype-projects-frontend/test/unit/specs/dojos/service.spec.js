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
    it('should make the correct API call', async () => {
      // ARRANGE
      const dojoIdMock = '1234-5678';
      const dojoMock = {
        id: '1234-5678',
        name: 'My Local Dojo',
      };
      sandbox.stub(Vue.http, 'get').withArgs(`${Vue.config.apiServer}/api/2.0/dojos/${dojoIdMock}`).resolves(dojoMock);
      
      // ACT
      const dojo = await DojoService.getDojoById(dojoIdMock);
      
      // ASSERT
      expect(dojo).to.equal(dojoMock);
    });
  });
  describe('getUsersDojos', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      const userIdMock = '1234-5678';
      const usersDojosMock = ['5678-1234'];
      sandbox.stub(Vue.http, 'get').withArgs(`${Vue.config.apiServer}/api/2.0/dojos/dojos-for-user/${userIdMock}`).resolves(usersDojosMock);
      
      // ACT
      const usersDojos = await DojoService.getUsersDojos(userIdMock);
      
      // ASSERT
      expect(usersDojos).to.equal(usersDojosMock);
    });
  });
  describe('getUsersDojosWithGitHub', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      const userIdMock = '1234-5678';
      const usersDojosWithGitHubMock = ['5678-1234'];
      sandbox.stub(Vue.http, 'get').withArgs(`${Vue.config.apiServer}/api/2.0/dojos/dojos-for-user-with-github/${userIdMock}`).resolves(usersDojosWithGitHubMock);
      
      // ACT
      const usersDojosWithGitHub = await DojoService.getUsersDojosWithGitHub(userIdMock);
      
      // ASSERT
      expect(usersDojosWithGitHub).to.equal(usersDojosWithGitHubMock);
    });
  });
  describe('getDojoByGitHubId', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      const githubIdMock = '5678-1234';
      const dojoMock = {
        id: '1234-5678',
        name: 'My Local Dojo',
      };
      sandbox.stub(Vue.http, 'get').withArgs(`${Vue.config.apiServer}/api/2.0/dojos/dojo-by-github-integration/${githubIdMock}`).resolves(dojoMock);
      
      // ACT
      const dojo = await DojoService.getDojoByGitHubId(githubIdMock);
      
      // ASSERT
      expect(dojo).to.equal(dojoMock);
    });
  });
  describe('isGitHubIntegrated', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      const dojoIdMock = '1234-5678';
      sandbox.stub(Vue.http, 'get').withArgs(`${Vue.config.apiServer}/api/2.0/dojos/is-github-integrated/${dojoIdMock}`).resolves('expectedResponse');
      
      // ACT
      const response = await DojoService.isGitHubIntegrated(dojoIdMock);
      
      // ASSERT
      expect(response).to.equal('expectedResponse');
    });
  });
  describe('completeGitHubIntegration', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      const dojoIdMock = '1234-5678';
      const userIdMock = '5678-1234';
      const githubDataMock = 'githubData';
      sandbox.stub(Vue.http, 'post').withArgs(`${Vue.config.apiServer}/api/2.0/dojos/${dojoIdMock}/${userIdMock}/integrations/github`, githubDataMock).resolves('expectedResponse');
      
      // ACT
      const response = await DojoService.completeGitHubIntegration(dojoIdMock, userIdMock, githubDataMock);
      
      // ASSERT
      expect(response).to.equal('expectedResponse');
    });
  });
  describe('removeGitHubIntegration', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      const dojoIdMock = '1234-5678';
      sandbox.stub(Vue.http, 'post').withArgs(`${Vue.config.apiServer}/api/2.0/dojos/${dojoIdMock}/remove-github-integration`).resolves('expectedResponse');
      
      // ACT
      const response = await DojoService.removeGitHubIntegration(dojoIdMock);
      
      // ASSERT
      expect(response).to.equal('expectedResponse');
    });
  });
});