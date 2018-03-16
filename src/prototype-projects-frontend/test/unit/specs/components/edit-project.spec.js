import EditProject from '!!vue-loader?inject!@/components/edit-project';
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
    describe('updateDetails', () => {
      it('should make the API call to update the project', async () => {
        // ARRANGE
        let editProject = vueUnitHelper(editProjectWithMocks);
        editProject.projectData = {
          project_id: '1234-5678',
          type: 'python',
        };
        editProject.name = 'Test Project';
        editProject.description = 'A test project.';
        editProject.entrypoint = 'TestProject.py';
        const expectedProjectData = {
          projectId: editProject.projectData.project_id,
          type: editProject.projectData.type,
          columns: ['name', 'description', 'entrypoint'],
          values: [editProject.name, editProject.description, editProject.entrypoint],
        };
        
        // ACT
        await editProject.updateDetails();
        
        // ASSERT
        expect(projectServiceMock.updateProject).to.have.been.calledWith(expectedProjectData);
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
    describe('updateFiles', () => {
      it('should make the API call to update the project if a file has been uploaded', async () => {
        // ARRANGE
        let editProject = vueUnitHelper(editProjectWithMocks);
        editProject.projectData = {
          project_id: '1234-5678',
          type: 'python',
          github_integration_id: '5678-1234',
        };
        editProject.filename = 'TestProject.zip'
        editProject.uploadedFile = 'fileData';
        editProject.isFileUploaded = true;
        const expectedProjectData = {
          projectId: editProject.projectData.project_id,
          type: editProject.projectData.type,
          githubIntegrationId: editProject.projectData.github_integration_id,
          filename: editProject.filename,
          file: editProject.uploadedFile,
        };
        
        // ACT
        await editProject.updateFiles();
        
        // ASSERT
        expect(projectServiceMock.updateProject).to.have.been.calledWith(expectedProjectData);
      });
      it('should not make the API call to update the project if no file has been uploaded', async () => {
        // ARRANGE
        let editProject = vueUnitHelper(editProjectWithMocks);
        editProject.isFileUploaded = false;
        editProject.uploadedFile = null;
        
        // ACT
        await editProject.updateFiles();
        
        // ASSERT
        expect(projectServiceMock.updateProject).to.not.have.been.called;
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
        expect(projectServiceMock.deleteProjectById).to.have.been.calledWith(projectIdMock);
        expect(editProject.$router.push).to.have.been.calledWith('/');
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
    });
  });
});