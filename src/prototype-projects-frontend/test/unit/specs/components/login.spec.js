import Login from '!!vue-loader?inject!@/components/login';
import vueUnitHelper from 'vue-unit-helper';

describe('Login', () => {
  let sandbox;
  let userServiceMock;
  let loginWithMocks;
  
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    userServiceMock = {
      login: sinon.stub(),
    };
    loginWithMocks = Login({
      '@/users/service': userServiceMock,
    });
  });
  
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('methods', () => {
    describe('isValid', () => {
      it('should return true if there are no form errors', () => {
        // ARRANGE
        let login = vueUnitHelper(Login());
        login.isFormValidated = false;
        login.errors = {
          any: () => false
        };
        
        // ACT
        let result = login.isValid();
        
        // ASSERT
        expect(login.isFormValidated).to.equal(true);
        expect(result).to.equal(true);
      });
      it('should return false if there are form errors', () => {
        // ARRANGE
        let login = vueUnitHelper(Login());
        login.isFormValidated = false;
        login.errors = {
          any: () => true
        };
        
        // ACT
        let result = login.isValid();
        
        // ASSERT
        expect(login.isFormValidated).to.equal(true);
        expect(result).to.equal(false);
      });
    });
    describe('login', () => {
      it('should check for user information and give them a login cookie if it is correct', async () => {
        // ARRANGE
        let login = vueUnitHelper(loginWithMocks);
        sandbox.stub(login, 'isValid');
        login.isValid.returns(true);
        login.email = 'test@example.com';
        login.password = 'testpassword';
        let expectedLoginData = {
          email: 'test@example.com',
          password: 'testpassword',
        };
        let mockResponse = {
          body: {
            id: '1234-5678',
          },
        };
        userServiceMock.login.withArgs(expectedLoginData).returns(mockResponse);
        login.$cookies = {
          set: () => null
        };
        sandbox.spy(login.$cookies, 'set');
        login.$router = {
          push: () => null
        };
        sandbox.spy(login.$router, 'push');
        
        // ACT
        await login.login();
        
        // ASSERT
        expect(login.loginFailed).to.equal(false);
        expect(login.$cookies.set).to.have.been.calledWith('loggedIn', '1234-5678');
        expect(login.$router.push).to.have.been.calledWith('/view-profile/1234-5678');
      });
      it('should check for user information and not give them a login cookie if it is incorrect', async () => {
        // ARRANGE
        let login = vueUnitHelper(loginWithMocks);
        sandbox.stub(login, 'isValid');
        login.isValid.returns(true);
        login.email = 'unknown@example.com';
        login.password = 'unknownpassword';
        let expectedLoginData = {
          email: 'unknown@example.com',
          password: 'unknownpassword',
        };
        let mockResponse = {
          body: null
        };
        userServiceMock.login.withArgs(expectedLoginData).returns(mockResponse);
        login.$cookies = {
          set: () => null
        };
        sandbox.spy(login.$cookies, 'set');
        login.$router = {
          push: () => null
        };
        sandbox.spy(login.$router, 'push');
        
        // ACT
        await login.login();
        
        // ASSERT
        expect(login.loginFailed).to.equal(true);
        expect(login.$cookies.set).to.not.have.been.called;
        expect(login.$router.push).to.not.have.been.called;
      });
      it('should do nothing with invalid form data', () => {
        // ARRANGE
        let login = vueUnitHelper(loginWithMocks);
        sandbox.stub(login, 'isValid');
        login.isValid.returns(false);
        login.$cookies = {
          set: () => null
        };
        sandbox.spy(login.$cookies, 'set');
        login.$router = {
          push: () => null
        };
        sandbox.spy(login.$router, 'push');
        
        // ACT
        login.login();
        
        // ASSERT
        expect(login.loginFailed).to.equal(false);
        expect(login.$cookies.set).to.not.have.been.called;
        expect(login.$router.push).to.not.have.been.called;
      });
    });
  });
});