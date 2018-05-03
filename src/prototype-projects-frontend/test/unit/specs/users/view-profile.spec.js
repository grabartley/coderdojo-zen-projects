import ViewProfile from '!!vue-loader?inject!@/users/view-profile';
import vueUnitHelper from 'vue-unit-helper';

describe('ViewProfile', () => {
  let sandbox;
  let userServiceMock;
  let dojoServiceMock;
  let projectServiceMock;
  let viewProfileWithMocks;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    userServiceMock = {
      getUserData: sinon.stub(),
    };
    dojoServiceMock = {
      getUsersDojos: sinon.stub(),
    };
    projectServiceMock = {
      getProjectsForUser: sinon.stub(),
    };
    viewProfileWithMocks = ViewProfile({
      '@/users/service': userServiceMock,
      '@/dojos/service': dojoServiceMock,
      '@/projects/service': projectServiceMock,
      '@/assets/python-logo.png': 'pathToPythonLogo',
      '@/assets/nodejs-logo.png': 'pathToNodeJSLogo',
      '@/assets/html5-logo.png': 'pathToHtml5Logo',
      '@/assets/java-logo.png': 'pathToJavaLogo',
      '@/assets/create-project-icon.png': 'pathToCreateProjectIcon',
    });
  });
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('methods', () => {
    describe('projectTypeImage', () => {
      it('should return the path of the image for any project type', () => {
        // ARRANGE
        let viewProfile = vueUnitHelper(viewProfileWithMocks);
        let typeMock = 'python';
        
        // ACT & ASSERT
        expect(viewProfile.projectTypeImage(typeMock)).to.equal('pathToPythonLogo');
        
        // ARRANGE
        typeMock = 'javascript';
        
        // ACT & ASSERT
        expect(viewProfile.projectTypeImage(typeMock)).to.equal('pathToNodeJSLogo');
        
        // ARRANGE
        typeMock = 'html';
        
        // ACT & ASSERT
        expect(viewProfile.projectTypeImage(typeMock)).to.equal('pathToHtml5Logo');
        
        // ARRANGE
        typeMock = 'java';
        
        // ACT & ASSERT
        expect(viewProfile.projectTypeImage(typeMock)).to.equal('pathToJavaLogo');
        
        // ARRANGE
        typeMock = 'new';
        
        // ACT & ASSERT
        expect(viewProfile.projectTypeImage(typeMock)).to.equal('pathToCreateProjectIcon');
        
        // ARRANGE
        typeMock = 'unknown';
        
        // ACT & ASSERT
        expect(viewProfile.projectTypeImage(typeMock)).to.equal('');
      });
    });
    describe('viewProject', () => {
      it('should redirect the user to the Project Details page', () => {
        // ARRANGE
        let viewProfile = vueUnitHelper(ViewProfile());
        const projectIdMock = '8765-4321';
        viewProfile.$router = {
          push: sandbox.spy(),
        };
        
        // ACT
        viewProfile.viewProject(projectIdMock);
        
        // ASSERT
        expect(viewProfile.$router.push).to.have.been.calledWith('/project/8765-4321');
      });
    });
    describe('createProject', () => {
      it('should redirect the user to the Project Creation form', () => {
        // ARRANGE
        let viewProfile = vueUnitHelper(ViewProfile());
        viewProfile.$router = {
          push: sandbox.spy(),
        };
        
        // ACT
        viewProfile.createProject();
        
        // ASSERT
        expect(viewProfile.$router.push).to.have.been.calledWith('/create-project');
      });
    });
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
    it('should get user, dojo and project data and note that the logged in user is viewing their own profile', async () => {
      // ARRANGE
      let viewProfile = vueUnitHelper(viewProfileWithMocks);
      viewProfile.$route = {
        params: {
          userId: '1234-5678',
        },
      };
      viewProfile.$cookie = {
        get: sandbox.stub(),
      };
      const expectedUserData = {
        id: '1234-5678',
      };
      const expectedUsersDojos = [
        'dojo 1',
        'dojo 2',
        'dojo 3',
      ];
      const expectedUsersProjects = [
        'project 1',
        'project 2',
        'project 3',
      ];
      viewProfile.$cookie.get.withArgs('loggedIn').returns('1234-5678');
      userServiceMock.getUserData.withArgs('1234-5678').resolves({
        body: expectedUserData,
      });
      dojoServiceMock.getUsersDojos.withArgs('1234-5678').resolves({
        body: expectedUsersDojos,
      });
      projectServiceMock.getProjectsForUser.withArgs('1234-5678').resolves({
        body: expectedUsersProjects,
      });
      
      // ACT
      await viewProfile.$lifecycleMethods.created();
      
      // ASSERT
      expect(userServiceMock.getUserData).to.have.been.calledWith('1234-5678');
      expect(dojoServiceMock.getUsersDojos).to.have.been.calledWith('1234-5678');
      expect(projectServiceMock.getProjectsForUser).to.have.been.calledWith('1234-5678');
      expect(viewProfile.userData).to.deep.equal(expectedUserData);
      expect(viewProfile.usersDojos).to.deep.equal(expectedUsersDojos);
      expect(viewProfile.usersProjects).to.deep.equal(expectedUsersProjects);
      expect(viewProfile.$cookie.get).to.have.been.calledWith('loggedIn');
      expect(viewProfile.isLoggedInUser).to.be.true;
    });
    it('should not set isLoggedInUser if no user is logged in', async () => {
      // ARRANGE
      let viewProfile = vueUnitHelper(viewProfileWithMocks);
      viewProfile.$route = {
        params: {
          userId: '1234-5678',
        },
      };
      viewProfile.$cookie = {
        get: sandbox.stub(),
      };
      const expectedUserData = {
        id: '1234-5678',
      };
      const expectedUsersDojos = [
        'dojo 1',
        'dojo 2',
        'dojo 3',
      ];
      const expectedUsersProjects = [
        'project 1',
        'project 2',
        'project 3',
      ];
      viewProfile.$cookie.get.withArgs('loggedIn').returns(null);
      userServiceMock.getUserData.withArgs('1234-5678').resolves({
        body: expectedUserData,
      });
      dojoServiceMock.getUsersDojos.withArgs('1234-5678').resolves({
        body: expectedUsersDojos,
      });
      projectServiceMock.getProjectsForUser.withArgs('1234-5678').resolves({
        body: expectedUsersProjects,
      });
      
      // ACT
      await viewProfile.$lifecycleMethods.created();
      
      // ASSERT
      expect(viewProfile.$cookie.get).to.have.been.calledWith('loggedIn');
      expect(viewProfile.isLoggedInUser).to.be.false;
    });
  });
});