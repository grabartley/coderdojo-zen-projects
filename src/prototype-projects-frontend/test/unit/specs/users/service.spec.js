import UserService from '@/users/service';
import Vue from 'vue';

describe('UserService', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('getUserData', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      sandbox.stub(Vue.http, 'get');
      let userIdMock = '1234-5678'
      Vue.http.get.withArgs(`${Vue.config.apiServer}/api/2.0/profiles/load-user-profile/${userIdMock}`).returns('expectedResponse');
      
      // ACT
      let result = await UserService.getUserData(userIdMock);
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
  describe('login', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      sandbox.stub(Vue.http, 'post');
      let loginDataMock = {
        email: 'champion1@example.com',
        email: 'testchampion1',
      };
      Vue.http.post.withArgs(`${Vue.config.apiServer}/api/2.0/users/login`, loginDataMock).returns('expectedResponse');
      
      // ACT
      let result = await UserService.login(loginDataMock);
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
  describe('storeAccessToken', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      sandbox.stub(Vue.http, 'post');
      let userIdMock = '1234-5678';
      let githubDataMock = {
        client_id: '5678-1234',
        code: '8765-4321',
      };
      Vue.http.post.withArgs(`${Vue.config.apiServer}/api/2.0/users/${userIdMock}/integrations/github`, githubDataMock).returns('expectedResponse');  
      
      // ACT
      let result = await UserService.storeAccessToken(userIdMock, githubDataMock);
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
});