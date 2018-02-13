import ViewProfile from '!!vue-loader?inject!@/components/view-profile';
import vueUnitHelper from 'vue-unit-helper';

describe('ViewProfile', () => {
  let sandbox;
  let userServiceMock;
  let viewProfileWithMocks;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    userServiceMock = {
      getUserData: sinon.stub(),
    };
    viewProfileWithMocks = ViewProfile({
      '@/users/service': userServiceMock,
    });
  });
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('computed', () => {
    describe('isGitHubLinked', () => {
      it('should return true if the current user has a GitHub access token', () => {
        // ARRANGE
        let viewProfile = vueUnitHelper(ViewProfile());
        viewProfile.userData = {
          githubAccessToken: '1234-5678',
        };
        
        // ACT
        let result = viewProfile.isGitHubLinked;
        
        // ASSERT
        expect(result).to.equal(true);
      });
      it('should return false if the current user does not have a GitHub access token', () => {
        // ARRANGE
        let viewProfile = vueUnitHelper(ViewProfile());
        viewProfile.userData = {
          githubAccessToken: null,
        };
        
        // ACT
        let result = viewProfile.isGitHubLinked;
        
        // ASSERT
        expect(result).to.equal(false);
      });
    });
    describe('githubAuthUrl', () => {
      it('should return the url to redirect the user to the OAuth flow', () => {
        // ARRANGE
        let viewProfile = vueUnitHelper(ViewProfile());
        viewProfile.githubClientId = '1234-5678';
        
        // ACT
        let result = viewProfile.githubAuthUrl;
        
        // ASSERT
        expect(result).to.equal('https://github.com/login/oauth/authorize?scope=public_repo&client_id=1234-5678');
      });
    });
  });
  
  describe('created', () => {
    it('should get the user id from the route params and use the user service to get user data', async () => {
      // ARRANGE
      let viewProfile = vueUnitHelper(viewProfileWithMocks);
      viewProfile.$route = {
        params: {
          userId: '1234-5678',
        },
      };
      userServiceMock.getUserData.withArgs('1234-5678').returns(Promise.resolve({
        body: {
          githubAccessToken: null,
        },
      }));
      let expectedUserData = {
        githubAccessToken: null,
      };
      
      // ACT
      await viewProfile.$lifecycleMethods.created();
      
      // ASSERT
      expect(viewProfile.userData).to.deep.equal(expectedUserData);
    });
  });
});