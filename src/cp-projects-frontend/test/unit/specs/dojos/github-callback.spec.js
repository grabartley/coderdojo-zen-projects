import GitHubCallback from '!!vue-loader?inject!@/dojos/github-callback';
import vueUnitHelper from 'vue-unit-helper';

describe('GitHubCallback', () => {
  let sandbox;
  let dojoServiceMock;
  let githubCallbackWithMocks;
  
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    dojoServiceMock = {
      completeGitHubIntegration: sinon.stub(),
    };
    githubCallbackWithMocks = GitHubCallback({
      '@/dojos/service': dojoServiceMock,
    });
  });
  
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('computed', () => {
    describe('dojoId', () => {
      it('should return the dojo id given in the url', () => {
        // ARRANGE
        let githubCallback = vueUnitHelper(GitHubCallback());
        githubCallback.$route = {
          query: {
            dojoId: '5678-1234',
          }
        };
        
        // ACT & ASSERT
        expect(githubCallback.dojoId).to.equal('5678-1234');
      });
    });
    describe('callbackCode', () => {
      it('should return the tmp code given in the url', () => {
        // ARRANGE
        let githubCallback = vueUnitHelper(GitHubCallback());
        githubCallback.$route = {
          query: {
            code: '1234',
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
        githubCallback.$cookie = {
          get: () => '1234-5678',
        };
        sandbox.spy(githubCallback.$cookie, 'get');
        
        // ACT & ASSERT
        expect(githubCallback.loggedInUserId).to.equal('1234-5678');
        expect(githubCallback.$cookie.get).to.have.been.calledWith('loggedIn');
      });
    });
  });

  describe('methods', () => {
    describe('integrateGitHub', () => {
      it('should call the dojo service function to complete GitHub integration', () => {
        // ARRANGE
        let githubCallback = vueUnitHelper(githubCallbackWithMocks);
        githubCallback.githubClientId = 'testClientId';
        githubCallback.dojoId = 'testDojoId';
        githubCallback.callbackCode = 'testCallbackCode';
        githubCallback.loggedInUserId = 'testLoggedInUserId';
        const expectedGitHubData = {
          client_id: 'testClientId',
          code: 'testCallbackCode',
        };
        
        // ACT
        githubCallback.integrateGitHub();
        
        // ASSERT
        expect(dojoServiceMock.completeGitHubIntegration).to.have.been.calledWith('testDojoId', 'testLoggedInUserId', expectedGitHubData);
      });
    });
  });
  
  describe('created', () => {
    it('should call integrateGitHub and redirect to the dojo admin panel', async () => {
      // ARRANGE
      let githubCallback = vueUnitHelper(GitHubCallback());
      githubCallback.dojoId = '5678-1234';
      githubCallback.$router = {
        push: sandbox.spy(),
      };
      sandbox.stub(githubCallback, 'integrateGitHub');
      
      // ACT
      await githubCallback.$lifecycleMethods.created();
      
      // ASSERT
      expect(githubCallback.integrateGitHub).to.have.been.calledOnce;
      expect(githubCallback.$router.push).to.have.been.calledWith('/admin-panel/5678-1234');
    });
  });
});