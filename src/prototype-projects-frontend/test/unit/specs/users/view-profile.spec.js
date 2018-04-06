import ViewProfile from '!!vue-loader?inject!@/users/view-profile';
import vueUnitHelper from 'vue-unit-helper';

describe('ViewProfile', () => {
  let sandbox;
  let userServiceMock;
  let dojoServiceMock;
  let viewProfileWithMocks;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    userServiceMock = {
      getUserData: sinon.stub(),
    };
    dojoServiceMock = {
      getUsersDojos: sinon.stub(),
    };
    viewProfileWithMocks = ViewProfile({
      '@/users/service': userServiceMock,
      '@/dojos/service': dojoServiceMock,
    });
  });
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('methods', () => {
    describe('editProfile', () => {
      it('should redirect the user to their Edit Profile page', () => {
        // ARRANGE
        let viewProfile = vueUnitHelper(ViewProfile());
        viewProfile.userData = {
          id: '1234-5678',
        };
        viewProfile.$router = {
          push: sandbox.spy(),
        };
        
        // ACT
        viewProfile.editProfile();
        
        // ASSERT
        expect(viewProfile.$router.push).to.have.been.calledWith('/edit-profile/1234-5678');
      });
    });
  });
  
  describe('created', () => {
    it('should get user data from route params and set currentUser if the user is viewing their own profile', async () => {
      // ARRANGE
      let viewProfile = vueUnitHelper(viewProfileWithMocks);
      viewProfile.$route = {
        params: {
          userId: '1234-5678',
        },
      };
      const expectedUserData = {
        id: '1234-5678',
      };
      const expectedUsersDojos = [
        'dojo 1',
        'dojo 2',
        'dojo 3',
      ];
      userServiceMock.getUserData.withArgs('1234-5678').returns(Promise.resolve({
        body: expectedUserData,
      }));
      dojoServiceMock.getUsersDojos.withArgs('1234-5678').returns(Promise.resolve({
        body: expectedUsersDojos,
      }));
      viewProfile.$cookies = {
        get: (cookieName) => '1234-5678',
      };
      
      // ACT
      await viewProfile.$lifecycleMethods.created();
      
      // ASSERT
      expect(userServiceMock.getUserData).to.have.been.calledWith('1234-5678');
      expect(dojoServiceMock.getUsersDojos).to.have.been.calledWith('1234-5678');
      expect(viewProfile.userData).to.deep.equal(expectedUserData);
      expect(viewProfile.usersDojos).to.deep.equal(expectedUsersDojos);
      expect(viewProfile.currentUser).to.equal('1234-5678');
    });
    it('should not set currentUser if the user is not viewing their own profile', async () => {
      // ARRANGE
      let viewProfile = vueUnitHelper(viewProfileWithMocks);
      viewProfile.$route = {
        params: {
          userId: '1234-5678',
        },
      };
      const expectedUserData = {
        id: '1234-5678',
      };
      const expectedUsersDojos = [
        'dojo 1',
        'dojo 2',
        'dojo 3',
      ];
      userServiceMock.getUserData.withArgs('1234-5678').returns(Promise.resolve({
        body: expectedUserData,
      }));
      dojoServiceMock.getUsersDojos.withArgs('1234-5678').returns(Promise.resolve({
        body: expectedUsersDojos,
      }));
      viewProfile.$cookies = {
        get: (cookieName) => '4321-5678',
      };
      
      // ACT
      await viewProfile.$lifecycleMethods.created();
      
      // ASSERT
      expect(viewProfile.currentUser).to.equal(null);
    });
  });
});