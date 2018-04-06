import GitHubCallback from '!!vue-loader?inject!@/dojos/github-callback';
import vueUnitHelper from 'vue-unit-helper';

describe('GitHubCallback', () => {
  let sandbox;
  let userServiceMock;
  let githubCallbackWithMocks;
  
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    userServiceMock = {
      storeAccessToken: sinon.stub(),
    };
    githubCallbackWithMocks = GitHubCallback({
      '@/users/service': userServiceMock,
    });
  });
  
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('computed', () => {
    describe('callbackCode', () => {
      it('should return the tmp code given in the url', () => {
        // ARRANGE
        let githubCallback = vueUnitHelper(GitHubCallback());
        githubCallback.$route = {
          query: {
            code: '1234'
          }
        };
        
        // ACT & ASSERT
        expect(githubCallback.callbackCode).to.equal('1234');
      });
    });
    describe('loggedInUserId', () => {
      it('should return the value associated with the LoggedIn cookie', () => {
        // ARRANGE
        let githubCallback = vueUnitHelper(GitHubCallback());
        githubCallback.$cookies = {
          get: () => '1234-5678'
        };
        sandbox.spy(githubCallback.$cookies, 'get');
        
        // ACT & ASSERT
        expect(githubCallback.loggedInUserId).to.equal('1234-5678');
        expect(githubCallback.$cookies.get).to.have.been.calledWith('loggedIn');
      });
    });
  });

  describe('methods', () => {
    describe('getAccessToken', () => {
      it('should call the user service function to get the access token', () => {
        // ARRANGE
        let githubCallback = vueUnitHelper(githubCallbackWithMocks);
        githubCallback.githubClientId = 'testClientId';
        githubCallback.callbackCode = 'testCallbackCode';
        githubCallback.loggedInUserId = 'testLoggedInUserId';
        const expectedGitHubData = {
          client_id: 'testClientId',
          code: 'testCallbackCode',
        };
        
        // ACT
        githubCallback.getAccessToken();
        
        // ASSERT
        expect(userServiceMock.storeAccessToken).to.have.been.calledWith('testLoggedInUserId', expectedGitHubData);
      });
    });
  });
  
  describe('created', () => {
    it('should call getAccessToken and redirect to the users profile page', async () => {
      // ARRANGE
      let githubCallback = vueUnitHelper(GitHubCallback());
      githubCallback.loggedInUserId = '1234-5678';
      githubCallback.$router = {
        push: sandbox.spy(),
      };
      sandbox.stub(githubCallback, 'getAccessToken');
      
      // ACT
      await githubCallback.$lifecycleMethods.created();
      
      // ASSERT
      expect(githubCallback.getAccessToken).to.have.been.calledOnce;
      expect(githubCallback.$router.push).to.have.been.calledWith('/view-profile/1234-5678');
    });
  });
});