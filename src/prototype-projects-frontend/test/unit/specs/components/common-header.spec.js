import CommonHeader from '@/components/common-header';
import vueUnitHelper from 'vue-unit-helper';

describe('CommonHeader', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('methods', () => {
    describe('logout', () => {
      it('should remove the loggedIn cookie and update the loggedIn data property', () => {
        // ARRANGE
        let commonHeader = vueUnitHelper(CommonHeader);
        commonHeader.$cookies = {
          remove: () => null
        };
        sandbox.spy(commonHeader.$cookies, 'remove');
        commonHeader.loggedIn = false;
        
        // ACT
        commonHeader.logout();
        
        // ASSERT
        expect(commonHeader.$cookies.remove).to.have.been.calledWith('loggedIn');
        expect(commonHeader.loggedIn).to.equal(false);
      });
    });
  });
  
  describe('created', () => {
    it('should get the current logged in user', () => {
      // ARRANGE
      let commonHeader = vueUnitHelper(CommonHeader);
      const userIdMock = '1234-5678';
      commonHeader.$cookies = {
        get: (cookieName) => userIdMock,
      };
      
      // ACT
      commonHeader.$lifecycleMethods.created();
      
      // ASSERT
      expect(commonHeader.loggedIn).to.equal(userIdMock);
    });
  });
});

