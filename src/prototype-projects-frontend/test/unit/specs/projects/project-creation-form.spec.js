import ProjectCreationForm from '!!vue-loader?inject!@/projects/project-creation-form';
import vueUnitHelper from 'vue-unit-helper';

describe('ProjectCreationForm', () => {
  let sandbox;
  let projectServiceMock;
  let dojoServiceMock;
  let projectCreationFormWithMocks;
  
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    projectServiceMock = {
      createProject: sinon.stub(),
    };
    dojoServiceMock = {
      getUsersDojosWithGitHub: sinon.stub(),
    };
    projectCreationFormWithMocks = ProjectCreationForm({
      '@/projects/service': projectServiceMock,
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
        let projectCreationForm = vueUnitHelper(ProjectCreationForm());
        projectCreationForm.isFormValidated = false;
        projectCreationForm.isFileUploaded = true;
        projectCreationForm.creatingProject = false;
        projectCreationForm.errors = {
          any: () => false
        };
        
        // ACT
        let result = projectCreationForm.isValid();
        
        // ASSERT
        expect(projectCreationForm.isFormValidated).to.equal(true);
        expect(result).to.equal(true);
      });
      it('should return false if there are form errors', () => {
        // ARRANGE
        let projectCreationForm = vueUnitHelper(ProjectCreationForm());
        projectCreationForm.isFormValidated = false;
        projectCreationForm.isFileUploaded = true;
        projectCreationForm.creatingProject = false;
        projectCreationForm.errors = {
          any: () => true
        };
        
        // ACT
        let result = projectCreationForm.isValid();
        
        // ASSERT
        expect(projectCreationForm.isFormValidated).to.equal(true);
        expect(result).to.equal(false);
      });
    });
    describe('onFileUpload', () => {
      it('should store a zip file in uploadedFile', () => {
        // ARRANGE
        let projectCreationForm = vueUnitHelper(ProjectCreationForm());
        projectCreationForm.isZip = false;
        projectCreationForm.isFileUploaded = false;
        projectCreationForm.filename = null;
        projectCreationForm.uploadedFile = null;
        let fileMock = new File([new Blob(['sample data'])], 'test.zip', {type: 'application/zip'});
        let eMock = {
          target: {
            files: [
              fileMock
            ],
          },
        };
        
        // ACT
        projectCreationForm.onFileUpload(eMock);
        
        // ASSERT
        expect(projectCreationForm.isZip).to.equal(true);
        expect(projectCreationForm.filename).to.equal('test.zip');
      });
      it('should not store other file types in uploadedFile', () => {
        // ARRANGE
        let projectCreationForm = vueUnitHelper(ProjectCreationForm());
        projectCreationForm.isZip = false;
        projectCreationForm.isFileUploaded = false;
        projectCreationForm.filename = null;
        projectCreationForm.uploadedFile = null;
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
        projectCreationForm.onFileUpload(eMock);
        
        // ASSERT
        expect(projectCreationForm.isZip).to.equal(false);
        expect(projectCreationForm.isFileUploaded).to.equal(false);
        expect(projectCreationForm.filename).to.equal('test.py');
        expect(projectCreationForm.uploadedFile).to.equal(null);
      });
      it('should do nothing if no files are present', () => {
        // ARRANGE
        let projectCreationForm = vueUnitHelper(ProjectCreationForm());
        projectCreationForm.isZip = false;
        projectCreationForm.isFileUploaded = false;
        projectCreationForm.filename = null;
        projectCreationForm.uploadedFile = null;
        let eMock = {
          target: {
            files: [],
          },
        };
        
        // ACT
        projectCreationForm.onFileUpload(eMock);
        
        // ASSERT
        expect(projectCreationForm.isZip).to.equal(false);
        expect(projectCreationForm.isFileUploaded).to.equal(false);
        expect(projectCreationForm.filename).to.equal(null);
        expect(projectCreationForm.uploadedFile).to.equal(null);
      });
    });
    describe('createProject', () => {
      it('should use the project service to create a project with valid project data', async () => {
        // ARRANGE
        let projectCreationForm = vueUnitHelper(projectCreationFormWithMocks);
        sandbox.stub(projectCreationForm, 'isValid').returns(true);
        projectCreationForm.$cookie = {
          get: sandbox.stub(),
        };
        projectCreationForm.$cookie.get.withArgs('loggedIn').returns('1234-5678');
        projectCreationForm.projectName = 'Test Project';
        projectCreationForm.projectType = 'python';
        projectCreationForm.projectDescription = 'A test project.';
        projectCreationForm.dojoId = '5678-1234';
        projectCreationForm.projectResource = 'http://kata.coderdojo.com/some-page';
        projectCreationForm.projectEntrypoint = 'test.py';
        projectCreationForm.filename = 'test.zip';
        projectCreationForm.uploadedFile = 'fileData';
        const expectedProjectData = {
          name: 'Test Project',
          type: 'python',
          description: 'A test project.',
          dojoId: '5678-1234',
          resourceUrl: 'http://kata.coderdojo.com/some-page',
          entrypoint: 'test.py',
          filename: 'test.zip',
          file: 'fileData',
          userId: '1234-5678',
        };
        const createProjectResponseMock = {
          body: '8765-4321',
        };
        projectCreationForm.$router = {
          push: sandbox.spy(),
        };
        projectServiceMock.createProject.withArgs(expectedProjectData).returns(Promise.resolve(createProjectResponseMock));

        // ACT
        await projectCreationForm.createProject();
        
        // ASSERT
        expect(projectCreationForm.creatingProject).to.be.true;
        expect(projectServiceMock.createProject).to.have.been.calledWith(expectedProjectData);
        expect(projectCreationForm.$router.push).to.have.been.calledWith('/project/8765-4321');
      });
      it('should not create a project if the form is not valid for any reason', async () => {
        // ARRANGE
        let projectCreationForm = vueUnitHelper(projectCreationFormWithMocks);
        sandbox.stub(projectCreationForm, 'isValid').returns(false);
        projectCreationForm.$router = {
          push: sandbox.spy(),
        };

        // ACT
        await projectCreationForm.createProject();
        
        // ASSERT
        expect(projectCreationForm.creatingProject).to.be.false;
        expect(projectServiceMock.createProject).to.not.have.been.called;
        expect(projectCreationForm.$router.push).to.not.have.been.called;
      });
    });
  });
  describe('created', () => {
    it('should get the logged in users joined dojos with GitHub integrations', async () => {
      // ARRANGE
      const projectCreationForm = vueUnitHelper(projectCreationFormWithMocks);
      projectCreationForm.usersDojos = null;
      projectCreationForm.loggedInUser = null;
      projectCreationForm.$cookie = {
        get: (cookieName) => '1234-5678',
      };
      projectCreationForm.$router = {
        push: () => null,
      };
      const usersDojosWithGitHubResponseMock = {
        body: [
          {
            id: '5678-1234',
            name: 'My Local Dojo',
          }
        ]
      };
      dojoServiceMock.getUsersDojosWithGitHub.withArgs('1234-5678').returns(Promise.resolve(usersDojosWithGitHubResponseMock));
      sandbox.spy(projectCreationForm.$router, 'push');
      
      // ACT
      await projectCreationForm.$lifecycleMethods.created();
      
      // ASSERT
      expect(projectCreationForm.loggedInUser).to.equal('1234-5678');
      expect(dojoServiceMock.getUsersDojosWithGitHub).to.have.been.calledWith('1234-5678');
      expect(projectCreationForm.usersDojos).to.deep.equal(usersDojosWithGitHubResponseMock.body);
      expect(projectCreationForm.$router.push).to.not.have.been.called;
    });
    it('should redirect back to project list if not logged in', async () => {
      // ARRANGE
      const projectCreationForm = vueUnitHelper(ProjectCreationForm());
      projectCreationForm.usersDojos = null;
      projectCreationForm.loggedInUser = null;
      projectCreationForm.$cookie = {
        get: (cookieName) => null,
      };
      projectCreationForm.$router = {
        push: () => null,
      };
      sandbox.spy(projectCreationForm.$router, 'push');
      
      // ACT
      await projectCreationForm.$lifecycleMethods.created();
      
      // ASSERT
      expect(projectCreationForm.loggedInUser).to.equal(null);
      expect(dojoServiceMock.getUsersDojosWithGitHub).to.not.have.been.called;
      expect(projectCreationForm.usersDojos).to.equal(null);
      expect(projectCreationForm.$router.push).to.have.been.calledWith('/');
    });
  });
  
  describe('watch', () => {
    describe('projectType', () => {
      it('should update booleans based on selected type', () => {
        // ARRANGE
        const projectCreationForm = vueUnitHelper(ProjectCreationForm());
        
        // ACT
        projectCreationForm.$watchers.projectType('python', null);
        
        // ASSERT
        expect(projectCreationForm.isPythonSelected).to.be.true;
        expect(projectCreationForm.isNodeJSSelected).to.be.false;
        expect(projectCreationForm.isHTMLSelected).to.be.false;
        expect(projectCreationForm.isJavaSelected).to.be.false;
        
        // ACT
        projectCreationForm.$watchers.projectType('javascript', null);
        
        // ASSERT
        expect(projectCreationForm.isPythonSelected).to.be.false;
        expect(projectCreationForm.isNodeJSSelected).to.be.true;
        expect(projectCreationForm.isHTMLSelected).to.be.false;
        expect(projectCreationForm.isJavaSelected).to.be.false;
        
        // ACT
        projectCreationForm.$watchers.projectType('html', null);
        
        // ASSERT
        expect(projectCreationForm.isPythonSelected).to.be.false;
        expect(projectCreationForm.isNodeJSSelected).to.be.false;
        expect(projectCreationForm.isHTMLSelected).to.be.true;
        expect(projectCreationForm.isJavaSelected).to.be.false;
        
        // ACT
        projectCreationForm.$watchers.projectType('java', null);
        
        // ASSERT
        expect(projectCreationForm.isPythonSelected).to.be.false;
        expect(projectCreationForm.isNodeJSSelected).to.be.false;
        expect(projectCreationForm.isHTMLSelected).to.be.false;
        expect(projectCreationForm.isJavaSelected).to.be.true;
      });
    });
  });
});