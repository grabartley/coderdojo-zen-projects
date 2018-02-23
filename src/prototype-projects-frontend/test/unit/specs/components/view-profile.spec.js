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
  
  describe('created', () => {
    it('should get user data from route params and check if the user is viewing their own profile', async () => {
      // ARRANGE
      let viewProfile = vueUnitHelper(viewProfileWithMocks);
      viewProfile.$route = {
        params: {
          userId: '1234-5678',
        },
      };
      userServiceMock.getUserData.withArgs('1234-5678').returns(Promise.resolve({
        body: {
          id: '1234-5678',
        },
      }));
      let expectedUserData = {
        id: '1234-5678',
      };
      viewProfile.$cookies = {
        get: (cookieName) => '1234-5678',
      };
      
      // ACT
      await viewProfile.$lifecycleMethods.created();
      
      // ASSERT
      expect(viewProfile.userData).to.deep.equal(expectedUserData);
      expect(viewProfile.currentUser).to.equal('1234-5678');
    });
  });
});