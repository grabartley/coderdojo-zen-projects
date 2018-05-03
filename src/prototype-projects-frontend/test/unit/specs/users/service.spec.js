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
      const userIdMock = '1234-5678'
      Vue.http.get.withArgs(`${Vue.config.apiServer}/api/2.0/profiles/load-user-profile/${userIdMock}`).returns('expectedResponse');
      
      // ACT
      const result = await UserService.getUserData(userIdMock);
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
  describe('isUserChampion', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      sandbox.stub(Vue.http, 'get');
      const userIdMock = '1234-5678';
      const dojoIdMock = '5678-1234'
      Vue.http.get.withArgs(`${Vue.config.apiServer}/api/2.0/users/is-champion/${userIdMock}/${dojoIdMock}`).returns('expectedResponse');
      
      // ACT
      const result = await UserService.isUserChampion(userIdMock, dojoIdMock);
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
  describe('isUserCDFAdmin', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      sandbox.stub(Vue.http, 'get');
      const userIdMock = '1234-5678';
      Vue.http.get.withArgs(`${Vue.config.apiServer}/api/2.0/users/is-cdf-admin/${userIdMock}`).returns('expectedResponse');
      
      // ACT
      const result = await UserService.isUserCDFAdmin(userIdMock);
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
  describe('login', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      sandbox.stub(Vue.http, 'post');
      const loginDataMock = {
        email: 'champion1@example.com',
        email: 'testchampion1',
      };
      Vue.http.post.withArgs(`${Vue.config.apiServer}/api/2.0/users/login`, loginDataMock).returns('expectedResponse');
      
      // ACT
      const result = await UserService.login(loginDataMock);
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
});