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
    describe('viewDojo', () => {
      it('should redirect the user to the Dojo page', () => {
        // ARRANGE
        let viewProfile = vueUnitHelper(ViewProfile());
        const dojoIdMock = '5678-1234';
        viewProfile.$router = {
          push: sandbox.spy(),
        };
        
        // ACT
        viewProfile.viewDojo(dojoIdMock);
        
        // ASSERT
        expect(viewProfile.$router.push).to.have.been.calledWith('/dojos/5678-1234');
      });
    });
  });
  
  describe('created', () => {
    it('should get user and dojo data', async () => {
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
      
      // ACT
      await viewProfile.$lifecycleMethods.created();
      
      // ASSERT
      expect(userServiceMock.getUserData).to.have.been.calledWith('1234-5678');
      expect(dojoServiceMock.getUsersDojos).to.have.been.calledWith('1234-5678');
      expect(viewProfile.userData).to.deep.equal(expectedUserData);
      expect(viewProfile.usersDojos).to.deep.equal(expectedUsersDojos);
    });
  });
});