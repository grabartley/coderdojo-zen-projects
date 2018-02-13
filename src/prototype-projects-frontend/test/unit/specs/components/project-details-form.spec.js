import ProjectDetailsForm from '@/components/project-details-form';
import vueUnitHelper from 'vue-unit-helper';

describe('ProjectDetailsForm', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('methods', () => {
    describe('isValid', () => {
      it('should return true if there are no form errors', () => {
        // ARRANGE
        let projectDetailsForm = vueUnitHelper(ProjectDetailsForm);
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
        let projectDetailsForm = vueUnitHelper(ProjectDetailsForm);
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
        let projectDetailsForm = vueUnitHelper(ProjectDetailsForm);
        projectDetailsForm.projectName = 'Test Project';
        projectDetailsForm.projectType = 'python';
        projectDetailsForm.projectMain = 'test.py';
        projectDetailsForm.projectDescription = 'A test project.';
        sandbox.spy(window.sessionStorage, 'setItem');
        
        // ACT
        projectDetailsForm.submitForm();
        
        // ASSERT
        expect(window.sessionStorage.setItem).to.have.been.calledWith('projectName', 'Test Project');
        expect(window.sessionStorage.setItem).to.have.been.calledWith('projectType', 'python');
        expect(window.sessionStorage.setItem).to.have.been.calledWith('projectMain', 'test.py');
        expect(window.sessionStorage.setItem).to.have.been.calledWith('projectDescription', 'A test project.');
      });
    });
  });
});