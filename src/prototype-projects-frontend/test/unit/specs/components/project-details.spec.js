import ProjectDetails from '!!vue-loader?inject!@/components/project-details';
import vueUnitHelper from 'vue-unit-helper';

describe('ProjectDetails', () => {
  let sandbox;
  let projectServiceMock;
  let dojoServiceMock;
  let projectDetailsWithMocks;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    projectServiceMock = {
      getProjectById: sinon.stub(),
    };
    dojoServiceMock = {
      getDojoByGitHubId: sinon.stub(),
    };
    projectDetailsWithMocks = ProjectDetails({
      '@/projects/service': projectServiceMock,
      '@/dojos/service': dojoServiceMock,
      '@/assets/python-logo.png': 'pathToPythonLogo',
      '@/assets/nodejs-logo.png': 'pathToNodeJSLogo',
      '@/assets/html5-logo.png': 'pathToHtml5Logo',
    });
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('computed', () => {
    describe('projectTypeImage', () => {
      it('should return the path of the image for any project type', () => {
        // ARRANGE
        let projectDetails = vueUnitHelper(projectDetailsWithMocks);
        projectDetails.projectData = {
          type: 'python',
        };
        
        // ACT & ASSERT
        expect(projectDetails.projectTypeImage).to.equal('pathToPythonLogo');
        
        // ARRANGE
        projectDetails.projectData = {
          type: 'javascript',
        };
        
        // ACT & ASSERT
        expect(projectDetails.projectTypeImage).to.equal('pathToNodeJSLogo');
        
        // ARRANGE
        projectDetails.projectData = {
          type: 'html',
        };
        
        // ACT & ASSERT
        expect(projectDetails.projectTypeImage).to.equal('pathToHtml5Logo');
        
        // ARRANGE
        projectDetails.projectData = {
          type: 'unknown',
        };
        
        // ACT & ASSERT
        expect(projectDetails.projectTypeImage).to.equal('');
      });
    });
    describe('projectType', () => {
      it('should return the formatted name of any project type', () => {
        // ARRANGE
        let projectDetails = vueUnitHelper(ProjectDetails());
        projectDetails.projectData = {
          type: 'python',
        };
        
        // ACT & ASSERT
        expect(projectDetails.projectType).to.equal('Python');
        
        // ARRANGE
        projectDetails.projectData = {
          type: 'javascript',
        };
        
        // ACT & ASSERT
        expect(projectDetails.projectType).to.equal('NodeJS');
        
        // ARRANGE
        projectDetails.projectData = {
          type: 'html',
        };
        
        // ACT & ASSERT
        expect(projectDetails.projectType).to.equal('HTML5');
        
        // ARRANGE
        projectDetails.projectData = {
          type: 'unknown',
        };
        
        // ACT & ASSERT
        expect(projectDetails.projectType).to.equal('');
      });
    });
    describe('lastUpdatedTime', () => {
      it('should return the formatted time of the last update', () => {
        // ARRANGE
        let projectDetails = vueUnitHelper(ProjectDetails());
        projectDetails.projectData = {
          created_at: '2018-02-23T22:26:22.884Z',
          updated_at: null,
        };
        
        // ACT & ASSERT
        expect(projectDetails.lastUpdatedTime).to.equal('10:26pm');
        
        // ARRANGE
        projectDetails = vueUnitHelper(ProjectDetails());
        projectDetails.projectData = {
          created_at: '2018-02-23T22:26:22.884Z',
          updated_at: '2018-02-23T05:14:55.884Z',
        };
        
        // ACT & ASSERT
        expect(projectDetails.lastUpdatedTime).to.equal('5:14am');
      });
    });
    describe('lastUpdatedDate', () => {
      it('should return the formatted date of the last update', () => {
        // ARRANGE
        let projectDetails = vueUnitHelper(ProjectDetails());
        projectDetails.projectData = {
          created_at: '2018-02-23T22:26:22.884Z',
          updated_at: null,
        };
        
        // ACT & ASSERT
        expect(projectDetails.lastUpdatedDate).to.equal('23rd of February 2018');
        
        // ARRANGE
        projectDetails = vueUnitHelper(ProjectDetails());
        projectDetails.projectData = {
          created_at: '2018-02-23T22:26:22.884Z',
          updated_at: '2018-03-02T05:14:55.884Z',
        };
        
        // ACT & ASSERT
        expect(projectDetails.lastUpdatedDate).to.equal('2nd of March 2018');
      });
    });
    describe('githubPagesLink', () => {
      it('should return the link to the html project on GitHub Pages', () => {
        // ARRANGE
        let projectDetails = vueUnitHelper(ProjectDetails());
        projectDetails.projectData = {
          project_id: '1234-5678',
          github: 'https://github.com/championone/1234-5678',
        };
        const expectedLink = 'https://championone.github.io/1234-5678';
        
        // ACT & ASSERT
        expect(projectDetails.githubPagesLink).to.equal(expectedLink);
      });
    });
  });
  describe('methods', () => {
    describe('editProject', () => {
      it('should redirect the user to edit this project', () => {
        // ARRANGE
        let projectDetails = vueUnitHelper(ProjectDetails());
        projectDetails.projectData = {
          project_id: '1234-5678',
        };
        projectDetails.$router = {
          push: () => null
        };
        sandbox.spy(projectDetails.$router, 'push');
        
        // ACT
        projectDetails.editProject();
        
        // ASSERT
        expect(projectDetails.$router.push).to.have.been.calledWith('/edit-project/1234-5678');
      });
    });
  });
  describe('created', () => {
    it('should get the data for this project (including Dojo data) and check if the logged in user owns it', async () => {
      // ARRANGE
      let projectDetails = vueUnitHelper(projectDetailsWithMocks);
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
      const dojoDataMock = {
        body: {
          id: '4321-5678',
          name: 'Test Dojo',
        }
      };
      projectDetails.$route = {
        params: {
          projectId: projectIdMock,
        },
      };
      projectDetails.$cookies = {
        get: (cookieName) => '4567-1238'
      };
      projectServiceMock.getProjectById.withArgs(projectIdMock).returns(Promise.resolve(projectDataMock));
      dojoServiceMock.getDojoByGitHubId.withArgs(projectDataMock.body.github_integration_id).returns(Promise.resolve(dojoDataMock));
      
      // ACT
      await projectDetails.$lifecycleMethods.created();
      
      // ASSERT
      expect(projectDetails.projectData).to.equal(projectDataMock.body);
      expect(projectDetails.dojoData).to.equal(dojoDataMock.body);
      expect(projectDetails.currentUser).to.equal(null);
      
      // ARRANGE
      projectDetails.$cookies = {
        get: (cookieName) => '5678-1234'
      };
      
      // ACT
      await projectDetails.$lifecycleMethods.created();
      
      // ASSERT
      expect(projectDetails.currentUser).to.equal('5678-1234');
    });
  });
});