import EditProfile from '!!vue-loader?inject!@/components/edit-profile';
import vueUnitHelper from 'vue-unit-helper';

describe('EditProfile', () => {
  let sandbox;
  let userServiceMock;
  let editProfileWithMocks;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    userServiceMock = {
      getUserData: sinon.stub(),
    };
    editProfileWithMocks = EditProfile({
      '@/users/service': userServiceMock,
    });
  });
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('computed', () => {
    describe('githubAuthUrl', () => {
      it('should return the url to redirect the user to the OAuth flow', () => {
        // ARRANGE
        let editProfile = vueUnitHelper(EditProfile());
        editProfile.githubClientId = '1234-5678';
        
        // ACT
        let result = editProfile.githubAuthUrl;
        
        // ASSERT
        expect(result).to.equal('https://github.com/login/oauth/authorize?scope=public_repo&client_id=1234-5678');
      });
    });
  });
  
  describe('methods', () => {
    describe('viewProfile', () => {
      it('should redirect to the View Profile page for this user', () => {
        // ARRANGE
        let editProfile = vueUnitHelper(EditProfile());
        editProfile.userData = {
          id: '1234-5678',
        };
        editProfile.$router = {
          push: sandbox.spy(),
        };
        
        // ACT
        editProfile.viewProfile();
        
        // ASSERT
        expect(editProfile.$router.push).to.have.been.calledWith('/view-profile/1234-5678');
      });
    });
  });
  
  describe('created', () => {
    it('should get user data', async () => {
      // ARRANGE
      let editProfile = vueUnitHelper(editProfileWithMocks);
      editProfile.$route = {
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
      
      // ACT
      await editProfile.$lifecycleMethods.created();
      
      // ASSERT
      expect(editProfile.userData).to.deep.equal(expectedUserData);
    });
  });
});