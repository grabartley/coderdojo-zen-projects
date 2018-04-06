import EditProject from '!!vue-loader?inject!@/projects/edit-project';
import vueUnitHelper from 'vue-unit-helper';

describe('EditProject', () => {
  let sandbox;
  let projectServiceMock;
  let editProjectWithMocks;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    projectServiceMock = {
      getProjectById: sinon.stub(),
      updateProject: sinon.stub(),
      deleteProjectById: sinon.stub(),
    };
    editProjectWithMocks = EditProject({
      '@/projects/service': projectServiceMock,
    });
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('methods', () => {
    describe('viewProject', () => {
      it('should redirect the user to the Project Details page for this project', async () => {
        // ARRANGE
        let editProject = vueUnitHelper(EditProject());
        editProject.projectData = {
          project_id: '1234-5678',
        };
        editProject.$router = {
          push: sandbox.spy(),
        };
        
        // ACT
        editProject.viewProject();
        
        // ASSERT
        expect(editProject.$router.push).to.have.been.calledWith('/project/1234-5678');
      });
    });
    describe('isValid', () => {
      it('should return true if there are no form errors', async () => {
        // ARRANGE
        let editProject = vueUnitHelper(EditProject());
        editProject.errors = {
          any: () => false,
        };
        
        // ACT
        const result = editProject.isValid();
        
        // ASSERT
        expect(editProject.isFormValidated).to.be.true;
        expect(result).to.be.true;
      });
      it('should return false if there are form errors', async () => {
        // ARRANGE
        let editProject = vueUnitHelper(EditProject());
        editProject.errors = {
          any: () => true,
        };
        
        // ACT
        const result = editProject.isValid();
        
        // ASSERT
        expect(editProject.isFormValidated).to.be.true;
        expect(result).to.be.false;
      });
    });
    describe('updateProject', () => {
      it('should make the API call to update the project if form data is valid', async () => {
        // ARRANGE
        let editProject = vueUnitHelper(editProjectWithMocks);
        editProject.projectData = {
          project_id: '1234-5678',
          type: 'python',
          github_integration_id: '8765-4321',
        };
        editProject.name = 'Test Project';
        editProject.description = 'A test project.';
        editProject.resource = 'http://kata.coderdojo.com/some-page';
        editProject.entrypoint = 'test.py';
        editProject.filename = 'TestProject.zip';
        editProject.uploadedFile = 'fileData';
        editProject.$router = {
          push: () => null,
        };
        const expectedUpdatePayload = {
          projectId: '1234-5678',
          type: 'python',
          columns: ['name', 'description', 'resource_url', 'entrypoint'],
          values: ['Test Project', 'A test project.', 'http://kata.coderdojo.com/some-page', 'test.py'],
          githubIntegrationId: '8765-4321',
          filename: 'TestProject.zip',
          file: 'fileData',
        };
        sandbox.stub(editProject, 'isValid').returns(true);
        sandbox.spy(editProject.$router, 'push');
        projectServiceMock.updateProject.withArgs(expectedUpdatePayload).returns(Promise.resolve('successful update'));
        
        // ACT
        await editProject.updateProject();
        
        // ASSERT
        expect(editProject.isValid).to.have.been.calledOnce;
        expect(editProject.updatingProject).to.be.true;
        expect(projectServiceMock.updateProject).to.have.been.calledWith(expectedUpdatePayload);
        expect(editProject.$router.push).to.have.been.calledWith('/project/1234-5678');
      });
      it('should not make the API call to update the project if form data is invalid', async () => {
        // ARRANGE
        let editProject = vueUnitHelper(editProjectWithMocks);
        editProject.$router = {
          push: () => null,
        };
        sandbox.stub(editProject, 'isValid').returns(false);
        sandbox.spy(editProject.$router, 'push');
        
        // ACT
        await editProject.updateProject();
        
        // ASSERT
        expect(editProject.isValid).to.have.been.calledOnce;
        expect(editProject.updatingProject).to.be.false;
        expect(projectServiceMock.updateProject).to.not.have.been.called;
        expect(editProject.$router.push).to.not.have.been.called;
      });
      it('should not make the API call to update the project if already updating the project', async () => {
        // ARRANGE
        let editProject = vueUnitHelper(editProjectWithMocks);
        editProject.updatingProject = true;
        editProject.$router = {
          push: () => null,
        };
        sandbox.stub(editProject, 'isValid').returns(true);
        sandbox.spy(editProject.$router, 'push');
        
        // ACT
        await editProject.updateProject();
        
        // ASSERT
        expect(editProject.isValid).to.have.been.calledOnce;
        expect(editProject.updatingProject).to.be.true;
        expect(projectServiceMock.updateProject).to.not.have.been.called;
        expect(editProject.$router.push).to.not.have.been.called;
      });
    });
    describe('onFileUpload', () => {
      it('should store a zip file in uploadedFile', () => {
        // ARRANGE
        let editProject = vueUnitHelper(EditProject());
        editProject.isZip = false;
        editProject.isFileUploaded = false;
        editProject.filename = null;
        editProject.uploadedFile = null;
        let fileMock = new File([new Blob(['sample data'])], 'test.zip', {type: 'application/zip'});
        let eMock = {
          target: {
            files: [
              fileMock
            ],
          },
        };
        
        // ACT
        editProject.onFileUpload(eMock);
        
        // ASSERT
        expect(editProject.isZip).to.equal(true);
        expect(editProject.filename).to.equal('test.zip');
      });
      it('should not store other file types in uploadedFile', () => {
        // ARRANGE
        let editProject = vueUnitHelper(EditProject());
        editProject.isZip = false;
        editProject.isFileUploaded = false;
        editProject.filename = null;
        editProject.uploadedFile = null;
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
        editProject.onFileUpload(eMock);
        
        // ASSERT
        expect(editProject.isZip).to.equal(false);
        expect(editProject.isFileUploaded).to.equal(false);
        expect(editProject.filename).to.equal(null);
        expect(editProject.uploadedFile).to.equal(null);
      });
      it('should do nothing if no files are present', () => {
        // ARRANGE
        let editProject = vueUnitHelper(EditProject());
        editProject.isZip = false;
        editProject.isFileUploaded = false;
        editProject.filename = null;
        editProject.uploadedFile = null;
        let eMock = {
          target: {
            files: [],
          },
        };
        
        // ACT
        editProject.onFileUpload(eMock);
        
        // ASSERT
        expect(editProject.isZip).to.equal(false);
        expect(editProject.isFileUploaded).to.equal(false);
        expect(editProject.filename).to.equal(null);
        expect(editProject.uploadedFile).to.equal(null);
      });
    });
    describe('deleteProject', () => {
      it('should make the API call to delete the project and then redirect the user', async () => {
        // ARRANGE
        let editProject = vueUnitHelper(editProjectWithMocks);
        const projectIdMock = '1234-5678';
        editProject.projectData = {
          project_id: projectIdMock,
          name: 'Test Project',
          type: 'python',
          entrypoint: 'TestProject.py',
          description: 'A test project.',
          github: 'https://github.com/championone/1234-5678',
          created_at: '2018-02-21T16:02:14.821Z',
          updated_at: null,
          author: 'Champion One',
          user_id: '5678-1234',
          github_integration_id: '8765-4321',
          deleted_at: null,
        };
        editProject.$router = {
          push: () => null,
        };
        projectServiceMock.deleteProjectById.withArgs(projectIdMock).returns(Promise.resolve({
          body: {
            response: 'delete successful',
          }
        }));
        sandbox.spy(editProject.$router, 'push');
        
        // ACT
        await editProject.deleteProject();
        
        // ASSERT
        expect(editProject.deletingProject).to.be.true;
        expect(projectServiceMock.deleteProjectById).to.have.been.calledWith(projectIdMock);
        expect(editProject.$router.push).to.have.been.calledWith('/');
      });
      it('shouldn\'t do anything if the project is already being deleted', async () => {
        // ARRANGE
        let editProject = vueUnitHelper(editProjectWithMocks);
        editProject.deletingProject = true;
        editProject.$router = {
          push: () => null,
        };
        sandbox.spy(editProject.$router, 'push');
        
        // ACT
        await editProject.deleteProject();
        
        // ASSERT
        expect(editProject.deletingProject).to.be.true;
        expect(projectServiceMock.deleteProjectById).to.not.have.been.called;
        expect(editProject.$router.push).to.not.have.been.called;
      });
    });
  });
  describe('created', () => {
    it('should get the data for this project', async () => {
      // ARRANGE
      let editProject = vueUnitHelper(editProjectWithMocks);
      const projectIdMock = '1234-5678';
      const projectDataMock = {
        body: {
          project_id: projectIdMock,
          name: 'Test Project',
          type: 'python',
          entrypoint: 'TestProject.py',
          description: 'A test project.',
          github: 'https://github.com/championone/1234-5678',
          resource_url: 'http://kata.coderdojo.com/some-page',
          created_at: '2018-02-21T16:02:14.821Z',
          updated_at: null,
          author: 'Champion One',
          user_id: '5678-1234',
          github_integration_id: '8765-4321',
          deleted_at: null,
        }
      };
      editProject.$route = {
        params: {
          projectId: projectIdMock,
        },
      };
      projectServiceMock.getProjectById.withArgs(projectIdMock).returns(Promise.resolve(projectDataMock));
      
      // ACT
      await editProject.$lifecycleMethods.created();
      
      // ASSERT
      expect(editProject.projectData).to.equal(projectDataMock.body);
      expect(editProject.name).to.equal('Test Project');
      expect(editProject.description).to.equal('A test project.');
      expect(editProject.resource).to.equal('http://kata.coderdojo.com/some-page');
      expect(editProject.entrypoint).to.equal('TestProject.py');
    });
  });
});