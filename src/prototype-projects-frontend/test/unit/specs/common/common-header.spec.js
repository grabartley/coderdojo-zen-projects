import CommonHeader from '!!vue-loader?inject!@/common/common-header';
import vueUnitHelper from 'vue-unit-helper';

describe('CommonHeader', () => {
  let sandbox;
  let userServiceMock;
  let commonHeaderWithMocks;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    userServiceMock = {
      getUserData: sinon.stub(),
    };
    commonHeaderWithMocks = CommonHeader({
      '@/users/service': userServiceMock,
    });
  });
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('methods', () => {
    describe('myProfile', () => {
      it('should redirect to the logged in users profile page', () => {
        // ARRANGE
        let commonHeader = vueUnitHelper(CommonHeader());
        commonHeader.$router = {
          push: sandbox.spy(),
        };
        commonHeader.loggedInUser = {
          id: '1234-5678',
        };
        commonHeader.profileDropdown = true;
        
        // ACT
        commonHeader.myProfile();
        
        // ASSERT
        expect(commonHeader.$router.push).to.have.been.calledWith('/view-profile/1234-5678');
        expect(commonHeader.profileDropdown).to.equal(false);
      });
    });
    describe('logout', () => {
      it('should log the user out', () => {
        // ARRANGE
        let commonHeader = vueUnitHelper(CommonHeader());
        commonHeader.$cookies = {
          remove: sandbox.spy(),
        };
        commonHeader.loggedInUser = {
          id: '1234-5678',
        };
        commonHeader.profileDropdown = true;
        
        // ACT
        commonHeader.logout();
        
        // ASSERT
        expect(commonHeader.$cookies.remove).to.have.been.calledWith('loggedIn');
        expect(commonHeader.loggedInUser).to.equal(null);
        expect(commonHeader.profileDropdown).to.equal(false);
      });
    });
  });
  
  describe('created', () => {
    it('should get the logged in user data', async () => {
      // ARRANGE
      let commonHeader = vueUnitHelper(commonHeaderWithMocks);
      const userIdMock = '1234-5678';
      const userDataResponseMock = {
        body: {
          id: '1234-5678',
        },
      };
      commonHeader.$cookies = {
        get: sandbox.stub(),
      };
      commonHeader.$cookies.get.withArgs('loggedIn').returns(userIdMock);
      userServiceMock.getUserData.withArgs(userIdMock).returns(Promise.resolve(userDataResponseMock));
      
      // ACT
      await commonHeader.$lifecycleMethods.created();
      
      // ASSERT
      expect(commonHeader.$cookies.get).to.have.been.calledWith('loggedIn');
      expect(userServiceMock.getUserData).to.have.been.calledWith(userIdMock);
      expect(commonHeader.loggedInUser).to.equal(userDataResponseMock.body);
    });
    it('should not get user data if there is no logged in user', async () => {
      // ARRANGE
      let commonHeader = vueUnitHelper(commonHeaderWithMocks);
      commonHeader.$cookies = {
        get: sandbox.stub(),
      };
      commonHeader.$cookies.get.withArgs('loggedIn').returns(null);
      
      // ACT
      await commonHeader.$lifecycleMethods.created();
      
      // ASSERT
      expect(commonHeader.$cookies.get).to.have.been.calledWith('loggedIn');
      expect(userServiceMock.getUserData).to.not.have.been.called;
      expect(commonHeader.loggedInUser).to.equal(null);
    });
  });
});

