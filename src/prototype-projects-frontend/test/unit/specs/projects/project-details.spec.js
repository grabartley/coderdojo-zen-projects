import ProjectDetails from '!!vue-loader?inject!@/projects/project-details';
import vueUnitHelper from 'vue-unit-helper';
import timeShift from 'timeshift-js';

describe('ProjectDetails', () => {
  let sandbox;
  let projectServiceMock;
  let dojoServiceMock;
  let projectDetailsWithMocks;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    projectServiceMock = {
      getProjectById: sinon.stub(),
      getProjectStatisticsById: sinon.stub(),
      incrementProjectPlays: sinon.stub(),
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
      '@/assets/java-logo.png': 'pathToJavaLogo',
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
          type: 'java',
        };
        
        // ACT & ASSERT
        expect(projectDetails.projectTypeImage).to.equal('pathToJavaLogo');
        
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
        expect(projectDetails.projectType).to.equal('Python 3');
        
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
          type: 'java',
        };
        
        // ACT & ASSERT
        expect(projectDetails.projectType).to.equal('Java');
        
        // ARRANGE
        projectDetails.projectData = {
          type: 'unknown',
        };
        
        // ACT & ASSERT
        expect(projectDetails.projectType).to.equal('');
      });
    });
    describe('lastUpdatedTime', () => {
      it('should return the formatted time of the last update in the users timezone', () => {
        // ARRANGE
        let projectDetails = vueUnitHelper(ProjectDetails());
        const defaultDate = Date;
        Date = timeShift.Date;
        timeShift.setTimezoneOffset(120);
        projectDetails.projectData = {
          created_at: '2018-02-23T22:26:22.884',
          updated_at: null,
        };
        
        // ACT & ASSERT
        expect(projectDetails.lastUpdatedTime).to.equal('12:26am');
        
        // ARRANGE
        projectDetails = vueUnitHelper(ProjectDetails());
        timeShift.setTimezoneOffset(-120);
        projectDetails.projectData = {
          created_at: '2018-02-23T22:26:22.884',
          updated_at: '2018-02-23T05:14:55.884',
        };
        
        // ACT & ASSERT
        expect(projectDetails.lastUpdatedTime).to.equal('3:14am');
        
        // RESET DATE
        Date = defaultDate;
      });
    });
    describe('lastUpdatedDate', () => {
      it('should return the formatted date of the last update in the users timezone', () => {
        // ARRANGE
        let projectDetails = vueUnitHelper(ProjectDetails());
        const defaultDate = Date;
        Date = timeShift.Date;
        timeShift.setTimezoneOffset(120);
        projectDetails.projectData = {
          created_at: '2018-02-23T23:26:22.884',
          updated_at: null,
        };
        
        // ACT & ASSERT
        expect(projectDetails.lastUpdatedDate).to.equal('24th of February 2018');
        
        // ARRANGE
        projectDetails = vueUnitHelper(ProjectDetails());
        timeShift.setTimezoneOffset(-120);
        projectDetails.projectData = {
          created_at: '2018-02-23T22:26:22.884',
          updated_at: '2018-03-02T01:14:55.884',
        };
        
        // ACT & ASSERT
        expect(projectDetails.lastUpdatedDate).to.equal('1st of March 2018');
        
        // RESET DATE
        Date = defaultDate;
      });
    });
    describe('githubPagesLink', () => {
      it('should return the link to the html project on GitHub Pages', () => {
        // ARRANGE
        let projectDetails = vueUnitHelper(ProjectDetails());
        projectDetails.projectData = {
          project_id: '1234-5678',
          github_url: 'https://github.com/championone/1234-5678',
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
      const projectStatisticsMock = {
        body: {
          plays: 115,
        }
      };
      const dojoDataMock = {
        body: {
          id: '4321-5678',
          name: 'Test Dojo',
        }
      };
      const expectedProjectData = {
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
        plays: 115,
      };
      projectDetails.$route = {
        params: {
          projectId: projectIdMock,
        },
      };
      projectDetails.$cookie = {
        get: (cookieName) => '4567-1238'
      };
      projectServiceMock.getProjectById.withArgs(projectIdMock).returns(Promise.resolve(projectDataMock));
      projectServiceMock.getProjectStatisticsById.withArgs(projectIdMock).returns(Promise.resolve(projectStatisticsMock));
      dojoServiceMock.getDojoByGitHubId.withArgs(projectDataMock.body.github_integration_id).returns(Promise.resolve(dojoDataMock));
      
      // ACT
      await projectDetails.$lifecycleMethods.created();
      
      // ASSERT
      expect(projectServiceMock.getProjectById).to.have.been.calledWith(projectIdMock);
      expect(projectServiceMock.getProjectStatisticsById).to.have.been.calledWith(projectIdMock);
      expect(projectDetails.projectData).to.deep.equal(expectedProjectData);
      expect(projectServiceMock.incrementProjectPlays).to.not.have.been.called;
      expect(projectDetails.dojoData).to.equal(dojoDataMock.body);
      expect(projectDetails.currentUser).to.equal(null);
      
      // ARRANGE
      projectDetails.$cookie = {
        get: (cookieName) => '5678-1234'
      };
      
      // ACT
      await projectDetails.$lifecycleMethods.created();
      
      // ASSERT
      expect(projectDetails.currentUser).to.equal('5678-1234');
    });
    it('should increment plays for a HTML5 project', async () => {
      // ARRANGE
      let projectDetails = vueUnitHelper(projectDetailsWithMocks);
      const projectIdMock = '1234-5678';
      const projectDataMock = {
        body: {
          project_id: projectIdMock,
          name: 'Test Project',
          type: 'html',
          entrypoint: 'index.html',
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
      const projectStatisticsMock = {
        body: {
          plays: 115,
        }
      };
      const dojoDataMock = {
        body: {
          id: '4321-5678',
          name: 'Test Dojo',
        }
      };
      const expectedProjectData = {
        project_id: projectIdMock,
        name: 'Test Project',
        type: 'html',
        entrypoint: 'index.html',
        description: 'A test project.',
        github: 'https://github.com/championone/1234-5678',
        created_at: '2018-02-21T16:02:14.821Z',
        updated_at: null,
        author: 'Champion One',
        user_id: '5678-1234',
        github_integration_id: '8765-4321',
        deleted_at: null,
        plays: 115,
      };
      projectDetails.$route = {
        params: {
          projectId: projectIdMock,
        },
      };
      projectDetails.$cookie = {
        get: (cookieName) => '4567-1238'
      };
      projectServiceMock.getProjectById.withArgs(projectIdMock).returns(Promise.resolve(projectDataMock));
      projectServiceMock.getProjectStatisticsById.withArgs(projectIdMock).returns(Promise.resolve(projectStatisticsMock));
      projectServiceMock.incrementProjectPlays.withArgs(projectIdMock).returns(Promise.resolve());
      dojoServiceMock.getDojoByGitHubId.withArgs(projectDataMock.body.github_integration_id).returns(Promise.resolve(dojoDataMock));
      
      // ACT
      await projectDetails.$lifecycleMethods.created();
      
      // ASSERT
      expect(projectServiceMock.incrementProjectPlays).to.have.been.calledWith(projectIdMock);
    });
  });
});