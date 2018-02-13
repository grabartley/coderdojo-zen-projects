import ProjectFilesForm from '@/components/project-files-form';
import vueUnitHelper from 'vue-unit-helper';

describe('ProjectFilesForm', () => {
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
        let projectFilesForm = vueUnitHelper(ProjectFilesForm);
        projectFilesForm.isFormValidated = false;
        projectFilesForm.errors = {
          any: () => true
        };
        
        // ACT
        let result = projectFilesForm.isValid();
        
        // ASSERT
        expect(projectFilesForm.isFormValidated).to.equal(true);
        expect(result).to.equal(false);
      });
      it('should return false if there are form errors', () => {
        // ARRANGE
        let projectFilesForm = vueUnitHelper(ProjectFilesForm);
        projectFilesForm.isFormValidated = false;
        projectFilesForm.errors = {
          any: () => true
        };
        
        // ACT
        let result = projectFilesForm.isValid();
        
        // ASSERT
        expect(projectFilesForm.isFormValidated).to.equal(true);
        expect(result).to.equal(false);
      });
    });
    describe('submitForm', () => {
      it('should save form data to session storage', () => {
        // ARRANGE
        let projectFilesForm = vueUnitHelper(ProjectFilesForm);
        projectFilesForm.filename = 'test.zip';
        projectFilesForm.uploadedFile = 'fileData';
        sandbox.spy(window.sessionStorage, 'setItem');
        
        // ACT
        projectFilesForm.submitForm();
        
        // ASSERT
        expect(window.sessionStorage.setItem).to.have.been.calledWith('filename', 'test.zip');
        expect(window.sessionStorage.setItem).to.have.been.calledWith('projectFiles', 'fileData');
      });
    });
    describe('onFileUpload', () => {
      it('should store a zip file in uploadedFile', () => {
        // ARRANGE
        let projectFilesForm = vueUnitHelper(ProjectFilesForm);
        projectFilesForm.isZip = false;
        projectFilesForm.isFileUploaded = false;
        projectFilesForm.filename = null;
        projectFilesForm.uploadedFile = null;
        let fileMock = new File([new Blob(['sample data'])], 'test.zip', {type: 'application/zip'});
        let eMock = {
          target: {
            files: [
              fileMock
            ],
          },
        };
        
        // ACT
        projectFilesForm.onFileUpload(eMock);
        
        // ASSERT
        expect(projectFilesForm.isZip).to.equal(true);
        expect(projectFilesForm.filename).to.equal('test.zip');
      });
      it('should not store other file types in uploadedFile', () => {
        // ARRANGE
        let projectFilesForm = vueUnitHelper(ProjectFilesForm);
        projectFilesForm.isZip = false;
        projectFilesForm.isFileUploaded = false;
        projectFilesForm.filename = null;
        projectFilesForm.uploadedFile = null;
        let eMock = {
          target: {
            files: [
              {
                name: 'test.py',
                type: 'text/python',
              }
            ],
          },
        };
        
        // ACT
        projectFilesForm.onFileUpload(eMock);
        
        // ASSERT
        expect(projectFilesForm.isZip).to.equal(false);
        expect(projectFilesForm.isFileUploaded).to.equal(false);
        expect(projectFilesForm.filename).to.equal(null);
        expect(projectFilesForm.uploadedFile).to.equal(null);
      });
      it('should do nothing if no files are present', () => {
        // ARRANGE
        let projectFilesForm = vueUnitHelper(ProjectFilesForm);
        projectFilesForm.isZip = false;
        projectFilesForm.isFileUploaded = false;
        projectFilesForm.filename = null;
        projectFilesForm.uploadedFile = null;
        let eMock = {
          target: {
            files: [],
          },
        };
        
        // ACT
        projectFilesForm.onFileUpload(eMock);
        
        // ASSERT
        expect(projectFilesForm.isZip).to.equal(false);
        expect(projectFilesForm.isFileUploaded).to.equal(false);
        expect(projectFilesForm.filename).to.equal(null);
        expect(projectFilesForm.uploadedFile).to.equal(null);
      });
    });
  });
});