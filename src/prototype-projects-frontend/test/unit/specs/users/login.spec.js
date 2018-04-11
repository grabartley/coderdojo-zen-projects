import Login from '!!vue-loader?inject!@/users/login';
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
        let loginDataMock = {
          email: 'test@example.com',
          password: 'testpassword',
        };
        let mockResponse = {
          body: {
            id: '1234-5678',
          },
        };
        userServiceMock.login.withArgs(loginDataMock).returns(mockResponse);
        login.$cookie = {
          set: sandbox.spy(),
        };
        login.$router = {
          push: sandbox.spy(),
          go: sandbox.spy(),
        };
        
        // ACT
        await login.login();
        
        // ASSERT
        expect(userServiceMock.login).to.have.been.calledWith(loginDataMock);
        expect(login.loginFailed).to.equal(false);
        expect(login.$cookie.set).to.have.been.calledWith('loggedIn', '1234-5678');
        expect(login.$router.push).to.have.been.calledWith('/view-profile/1234-5678');
        expect(login.$router.go).to.have.been.calledOnce;
      });
      it('should check for user information and not give them a login cookie if it is incorrect', async () => {
        // ARRANGE
        let login = vueUnitHelper(loginWithMocks);
        sandbox.stub(login, 'isValid');
        login.isValid.returns(true);
        login.email = 'unknown@example.com';
        login.password = 'unknownpassword';
        let loginDataMock = {
          email: 'unknown@example.com',
          password: 'unknownpassword',
        };
        let mockResponse = {
          body: null
        };
        userServiceMock.login.withArgs(loginDataMock).returns(mockResponse);
        login.$cookie = {
          set: sandbox.spy(),
        };
        login.$router = {
          push: sandbox.spy(),
          go: sandbox.spy(),
        };
        
        // ACT
        await login.login();
        
        // ASSERT
        expect(userServiceMock.login).to.have.been.calledWith(loginDataMock);
        expect(login.loginFailed).to.equal(true);
        expect(login.$cookie.set).to.not.have.been.called;
        expect(login.$router.push).to.not.have.been.called;
        expect(login.$router.go).to.not.have.been.called;
      });
      it('should do nothing with invalid form data', () => {
        // ARRANGE
        let login = vueUnitHelper(loginWithMocks);
        sandbox.stub(login, 'isValid');
        login.isValid.returns(false);
        login.$cookie = {
          set: () => null
        };
        sandbox.spy(login.$cookie, 'set');
        
        // ACT
        login.login();
        
        // ASSERT
        expect(login.loginFailed).to.equal(false);
        expect(login.$cookie.set).to.not.have.been.called;
      });
    });
  });
});