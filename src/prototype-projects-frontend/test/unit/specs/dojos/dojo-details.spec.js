import DojoDetails from '!!vue-loader?inject!@/dojos/dojo-details';
import vueUnitHelper from 'vue-unit-helper';

describe('DojoDetails', () => {
  let sandbox;
  let dojoServiceMock;
  let userServiceMock;
  let dojoDetailsWithMocks;
  
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    dojoServiceMock = {
      getDojoById: sinon.stub(),
      isGitHubIntegrated: sinon.stub(),
    };
    userServiceMock = {
      isUserChampion: sinon.stub(),
    };
    dojoDetailsWithMocks = DojoDetails({
      '@/dojos/service': dojoServiceMock,
      '@/users/service': userServiceMock,
    });
  });
  
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('methods', () => {
    describe('adminPanel', () => {
      it('should redirect the user to the admin panel for this Dojo', () => {
        // ARRANGE
        let dojoDetails = vueUnitHelper(DojoDetails());
        dojoDetails.$router = {
          push: sandbox.spy(),
        };
        dojoDetails.$route = {
          params: {
            dojoId: '1234-5678',
          },
        };
        
        // ACT
        dojoDetails.adminPanel();
        
        // ASSERT
        expect(dojoDetails.$router.push).to.have.been.calledWith('/admin-panel/1234-5678');
      });
    });
  });
  
  describe('created', () => {
    it('should get Dojo data, check if GitHub is integrated and check if logged in user is a champion of this Dojo', async () => {
      // ARRANGE
      let dojoDetails = vueUnitHelper(dojoDetailsWithMocks);
      const expectedDojoDataResponse = {
        body: 'expectedDojoData',
      };
      const isGitHubIntegratedResponse = {
        body: true,
      };
      const isLoggedInUserChampionResponse = {
        body: true,
      };
      dojoDetails.$route = {
        params: {
          dojoId: '1234-5678',
        },
      };
      dojoDetails.$cookie = {
        get: sandbox.stub(),
      };
      dojoDetails.$cookie.get.withArgs('loggedIn').returns('5678-1234');
      dojoServiceMock.getDojoById.withArgs('1234-5678').returns(Promise.resolve(expectedDojoDataResponse));
      dojoServiceMock.isGitHubIntegrated.withArgs('1234-5678').returns(Promise.resolve(isGitHubIntegratedResponse));
      userServiceMock.isUserChampion.withArgs('5678-1234', '1234-5678').returns(Promise.resolve(isLoggedInUserChampionResponse));
      
      // ACT
      await dojoDetails.$lifecycleMethods.created();
      
      // ASSERT
      expect(dojoServiceMock.getDojoById).to.have.been.calledWith('1234-5678');
      expect(dojoServiceMock.isGitHubIntegrated).to.have.been.calledWith('1234-5678');
      expect(userServiceMock.isUserChampion).to.have.been.calledWith('5678-1234', '1234-5678');
      expect(dojoDetails.dojoData).to.equal('expectedDojoData');
      expect(dojoDetails.isGitHubIntegrated).to.be.true;
      expect(dojoDetails.isLoggedInUserChampion).to.be.true;
    });
  });
});