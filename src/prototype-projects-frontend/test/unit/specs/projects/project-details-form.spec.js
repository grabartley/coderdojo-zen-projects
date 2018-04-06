import ProjectDetailsForm from '!!vue-loader?inject!@/projects/project-details-form';
import vueUnitHelper from 'vue-unit-helper';

describe('ProjectDetailsForm', () => {
  let sandbox;
  let dojoServiceMock;
  let projectDetailsFormWithMocks;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    dojoServiceMock = {
      getUsersDojos: sinon.stub(),
    };
    projectDetailsFormWithMocks = ProjectDetailsForm({
      '@/dojos/service': dojoServiceMock,
    });
  });
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('methods', () => {
    describe('isValid', () => {
      it('should return true if there are no form errors', () => {
        // ARRANGE
        let projectDetailsForm = vueUnitHelper(ProjectDetailsForm());
        projectDetailsForm.isFormValidated = false;
        projectDetailsForm.errors = {
          any: () => true
        };
        
        // ACT
        let result = projectDetailsForm.isValid();
        
        // ASSERT
        expect(projectDetailsForm.isFormValidated).to.equal(true);
        expect(result).to.equal(false);
      });
      it('should return false if there are form errors', () => {
        // ARRANGE
        let projectDetailsForm = vueUnitHelper(ProjectDetailsForm());
        projectDetailsForm.isFormValidated = false;
        projectDetailsForm.errors = {
          any: () => true
        };
        
        // ACT
        let result = projectDetailsForm.isValid();
        
        // ASSERT
        expect(projectDetailsForm.isFormValidated).to.equal(true);
        expect(result).to.equal(false);
      });
    });
    describe('submitForm', () => {
      it('should save form data to session storage', () => {
        // ARRANGE
        let projectDetailsForm = vueUnitHelper(ProjectDetailsForm());
        projectDetailsForm.projectName = 'Test Project';
        projectDetailsForm.projectType = 'python';
        projectDetailsForm.projectDescription = 'A test project.';
        projectDetailsForm.dojoId = '1234-5678';
        projectDetailsForm.projectResource = 'http://kata.coderdojo.com/some-page';
        sandbox.spy(window.sessionStorage, 'setItem');
        
        // ACT
        projectDetailsForm.submitForm();
        
        // ASSERT
        expect(window.sessionStorage.setItem).to.have.been.calledWith('projectName', 'Test Project');
        expect(window.sessionStorage.setItem).to.have.been.calledWith('projectType', 'python');
        expect(window.sessionStorage.setItem).to.have.been.calledWith('projectDescription', 'A test project.');
        expect(window.sessionStorage.setItem).to.have.been.calledWith('dojoId', '1234-5678');
        expect(window.sessionStorage.setItem).to.have.been.calledWith('projectResource', 'http://kata.coderdojo.com/some-page');
      });
    });
  });
  
  describe('created', () => {
    it('should get the logged in users joined dojos', async () => {
      // ARRANGE
      const projectDetailsForm = vueUnitHelper(projectDetailsFormWithMocks);
      projectDetailsForm.usersDojos = null;
      projectDetailsForm.loggedInUser = null;
      projectDetailsForm.$cookies = {
        get: (cookieName) => '1234-5678',
      };
      projectDetailsForm.$router = {
        push: () => null,
      };
      const usersDojosResponseMock = {
        body: [
          {
            id: '5678-1234',
            name: 'My Local Dojo',
          }
        ]
      };
      dojoServiceMock.getUsersDojos.withArgs('1234-5678').returns(Promise.resolve(usersDojosResponseMock));
      sandbox.spy(projectDetailsForm.$router, 'push');
      
      // ACT
      await projectDetailsForm.$lifecycleMethods.created();
      
      // ASSERT
      expect(projectDetailsForm.loggedInUser).to.equal('1234-5678');
      expect(dojoServiceMock.getUsersDojos).to.have.been.calledWith('1234-5678');
      expect(projectDetailsForm.usersDojos).to.deep.equal(usersDojosResponseMock.body);
      expect(projectDetailsForm.$router.push).to.not.have.been.called;
    });
    it('should redirect back to project list if not logged in', async () => {
      // ARRANGE
      const projectDetailsForm = vueUnitHelper(ProjectDetailsForm());
      projectDetailsForm.usersDojos = null;
      projectDetailsForm.loggedInUser = null;
      projectDetailsForm.$cookies = {
        get: (cookieName) => null,
      };
      projectDetailsForm.$router = {
        push: () => null,
      };
      sandbox.spy(projectDetailsForm.$router, 'push');
      
      // ACT
      await projectDetailsForm.$lifecycleMethods.created();
      
      // ASSERT
      expect(projectDetailsForm.loggedInUser).to.equal(null);
      expect(dojoServiceMock.getUsersDojos).to.not.have.been.called;
      expect(projectDetailsForm.usersDojos).to.equal(null);
      expect(projectDetailsForm.$router.push).to.have.been.calledWith('/');
    });
  });
  
  describe('watch', () => {
    describe('projectType', () => {
      it('should update booleans based on selected type', () => {
        // ARRANGE
        const projectDetailsForm = vueUnitHelper(ProjectDetailsForm());
        
        // ACT
        projectDetailsForm.$watchers.projectType('python', null);
        
        // ASSERT
        expect(projectDetailsForm.isPythonSelected).to.be.true;
        expect(projectDetailsForm.isNodeJSSelected).to.be.false;
        expect(projectDetailsForm.isHTMLSelected).to.be.false;
        expect(projectDetailsForm.isJavaSelected).to.be.false;
        
        // ACT
        projectDetailsForm.$watchers.projectType('javascript', null);
        
        // ASSERT
        expect(projectDetailsForm.isPythonSelected).to.be.false;
        expect(projectDetailsForm.isNodeJSSelected).to.be.true;
        expect(projectDetailsForm.isHTMLSelected).to.be.false;
        expect(projectDetailsForm.isJavaSelected).to.be.false;
        
        // ACT
        projectDetailsForm.$watchers.projectType('html', null);
        
        // ASSERT
        expect(projectDetailsForm.isPythonSelected).to.be.false;
        expect(projectDetailsForm.isNodeJSSelected).to.be.false;
        expect(projectDetailsForm.isHTMLSelected).to.be.true;
        expect(projectDetailsForm.isJavaSelected).to.be.false;
        
        // ACT
        projectDetailsForm.$watchers.projectType('java', null);
        
        // ASSERT
        expect(projectDetailsForm.isPythonSelected).to.be.false;
        expect(projectDetailsForm.isNodeJSSelected).to.be.false;
        expect(projectDetailsForm.isHTMLSelected).to.be.false;
        expect(projectDetailsForm.isJavaSelected).to.be.true;
      });
    });
  });
});