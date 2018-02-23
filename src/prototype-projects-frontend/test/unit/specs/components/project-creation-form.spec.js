import ProjectCreationForm from '!!vue-loader?inject!@/components/project-creation-form';
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
      it('should use the project service to create a project with valid project data', () => {
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
        window.sessionStorage.setItem('filename', 'test.zip');
        window.sessionStorage.setItem('projectFiles', 'fileData');
        sandbox.stub(projectCreationForm.$cookies, 'get').withArgs('loggedIn').returns('1234-5678');
        let expectedProjectData = {
          name: 'Test Project',
          type: 'python',
          entrypoint: 'test.py',
          description: 'A test project.',
          dojoId: '5678-1234',
          filename: 'test.zip',
          file: 'fileData',
          userId: '1234-5678',
        };
        projectCreationForm.$router = {
          push: () => null
        };
        sandbox.spy(projectCreationForm.$router, 'push');

        // ACT
        projectCreationForm.createProject();
        
        // ASSERT
        expect(projectServiceMock.createProject).to.have.been.calledWith(expectedProjectData);
        expect(projectCreationForm.$router.push).to.have.been.calledWith('/');
      });
      it('should not create a project with invalid project data', () => {
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
        sandbox.spy(projectCreationForm.$router, 'push');

        // ACT
        projectCreationForm.createProject();
        
        // ASSERT
        expect(projectServiceMock.createProject).to.not.have.been.called;
        expect(projectCreationForm.$router.push).to.not.have.been.called;
      });
    });
  });
});