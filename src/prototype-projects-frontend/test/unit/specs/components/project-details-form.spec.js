import ProjectDetailsForm from '!!vue-loader?inject!@/components/project-details-form';
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
        projectDetailsForm.projectEntrypoint = 'test.py';
        projectDetailsForm.projectDescription = 'A test project.';
        projectDetailsForm.dojo = {
          id: '1234-5678',
          name: 'My Local Dojo',
        };
        sandbox.spy(window.sessionStorage, 'setItem');
        
        // ACT
        projectDetailsForm.submitForm();
        
        // ASSERT
        expect(window.sessionStorage.setItem).to.have.been.calledWith('projectName', 'Test Project');
        expect(window.sessionStorage.setItem).to.have.been.calledWith('projectType', 'python');
        expect(window.sessionStorage.setItem).to.have.been.calledWith('projectEntrypoint', 'test.py');
        expect(window.sessionStorage.setItem).to.have.been.calledWith('projectDescription', 'A test project.');
        expect(window.sessionStorage.setItem).to.have.been.calledWith('dojoId', '1234-5678');
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
      const usersDojosResponseMock = {
        body: [
          {
            id: '5678-1234',
            name: 'My Local Dojo',
          }
        ]
      };
      dojoServiceMock.getUsersDojos.withArgs('1234-5678').returns(Promise.resolve(usersDojosResponseMock));
      
      // ACT
      await projectDetailsForm.$lifecycleMethods.created();
      
      // ASSERT
      expect(projectDetailsForm.loggedInUser).to.equal('1234-5678');
      expect(dojoServiceMock.getUsersDojos).to.have.been.calledWith('1234-5678');
      expect(projectDetailsForm.usersDojos).to.deep.equal(usersDojosResponseMock.body);
    });
  });
});