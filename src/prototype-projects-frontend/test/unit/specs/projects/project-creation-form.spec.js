import ProjectCreationForm from '!!vue-loader?inject!@/projects/project-creation-form';
import vueUnitHelper from 'vue-unit-helper';

describe('ProjectCreationForm', () => {
  let sandbox;
  let projectServiceMock;
  let projectCreationFormWithMocks;
  
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    projectServiceMock = {
      createProject: sinon.stub(),
    };
    projectCreationFormWithMocks = ProjectCreationForm({
      '@/projects/service': projectServiceMock,
    });
  });
  
  afterEach(() => {
    sandbox.restore();
  });

  describe('methods', () => {
    describe('createProject', () => {
      it('should use the project service to create a project with valid project data', async () => {
        // ARRANGE
        let projectCreationForm = vueUnitHelper(projectCreationFormWithMocks);
        projectCreationForm.$refs = {
          projectDetailsFormRef: {
            isValid: () => true,
            submitForm: () => null,
          },
          projectFilesFormRef: {
            isValid: () => true,
            submitForm: () => null,
          },
        };
        projectCreationForm.$cookies = {
          get: () => null,
        };
        window.sessionStorage.setItem('projectName', 'Test Project');
        window.sessionStorage.setItem('projectType', 'python');
        window.sessionStorage.setItem('projectEntrypoint', 'test.py');
        window.sessionStorage.setItem('projectDescription', 'A test project.');
        window.sessionStorage.setItem('dojoId', '5678-1234');
        window.sessionStorage.setItem('projectResource', 'http://kata.coderdojo.com/some-page');
        window.sessionStorage.setItem('filename', 'test.zip');
        window.sessionStorage.setItem('projectFiles', 'fileData');
        sandbox.stub(projectCreationForm.$cookies, 'get').withArgs('loggedIn').returns('1234-5678');
        const expectedProjectData = {
          name: 'Test Project',
          type: 'python',
          entrypoint: 'test.py',
          description: 'A test project.',
          dojoId: '5678-1234',
          resourceUrl: 'http://kata.coderdojo.com/some-page',
          filename: 'test.zip',
          file: 'fileData',
          userId: '1234-5678',
        };
        projectCreationForm.$router = {
          push: () => null
        };
        sandbox.spy(projectCreationForm.$refs.projectDetailsFormRef, 'submitForm');
        sandbox.spy(projectCreationForm.$refs.projectFilesFormRef, 'submitForm');
        sandbox.spy(projectCreationForm.$router, 'push');

        // ACT
        await projectCreationForm.createProject();
        
        // ASSERT
        expect(projectCreationForm.creatingProject).to.be.true;
        expect(projectCreationForm.$refs.projectDetailsFormRef.submitForm).to.have.been.calledOnce;
        expect(projectCreationForm.$refs.projectFilesFormRef.submitForm).to.have.been.calledOnce;
        expect(projectServiceMock.createProject).to.have.been.calledWith(expectedProjectData);
        expect(projectCreationForm.$router.push).to.have.been.calledWith('/');
      });
      it('should not create a project with invalid project data', async () => {
        // ARRANGE
        let projectCreationForm = vueUnitHelper(projectCreationFormWithMocks);
        projectCreationForm.$refs = {
          projectDetailsFormRef: {
            isValid: () => true,
            submitForm: () => null,
          },
          projectFilesFormRef: {
            isValid: () => false,
            submitForm: () => null,
          },
        };
        projectCreationForm.$router = {
          push: () => null
        };
        sandbox.spy(projectCreationForm.$refs.projectDetailsFormRef, 'submitForm');
        sandbox.spy(projectCreationForm.$refs.projectFilesFormRef, 'submitForm');
        sandbox.spy(projectCreationForm.$router, 'push');

        // ACT
        await projectCreationForm.createProject();
        
        // ASSERT
        expect(projectCreationForm.$refs.projectDetailsFormRef.submitForm).to.not.have.been.called;
        expect(projectCreationForm.$refs.projectFilesFormRef.submitForm).to.not.have.been.called;
        expect(projectCreationForm.creatingProject).to.be.false;
        expect(projectServiceMock.createProject).to.not.have.been.called;
        expect(projectCreationForm.$router.push).to.not.have.been.called;
      });
      it('should not create a project if already creating it', async () => {
        // ARRANGE
        let projectCreationForm = vueUnitHelper(projectCreationFormWithMocks);
        projectCreationForm.creatingProject = true;
        projectCreationForm.$refs = {
          projectDetailsFormRef: {
            isValid: () => true,
            submitForm: () => null,
          },
          projectFilesFormRef: {
            isValid: () => true,
            submitForm: () => null,
          },
        };
        projectCreationForm.$router = {
          push: () => null
        };
        sandbox.spy(projectCreationForm.$refs.projectDetailsFormRef, 'submitForm');
        sandbox.spy(projectCreationForm.$refs.projectFilesFormRef, 'submitForm');
        sandbox.spy(projectCreationForm.$router, 'push');

        // ACT
        await projectCreationForm.createProject();
        
        // ASSERT
        expect(projectCreationForm.$refs.projectDetailsFormRef.submitForm).to.not.have.been.called;
        expect(projectCreationForm.$refs.projectFilesFormRef.submitForm).to.not.have.been.called;
        expect(projectCreationForm.creatingProject).to.be.true;
        expect(projectServiceMock.createProject).to.not.have.been.called;
        expect(projectCreationForm.$router.push).to.not.have.been.called;
      });
    });
  });
});