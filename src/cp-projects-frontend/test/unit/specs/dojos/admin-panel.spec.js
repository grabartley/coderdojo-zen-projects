import AdminPanel from '!!vue-loader?inject!@/dojos/admin-panel';
import vueUnitHelper from 'vue-unit-helper';

describe('AdminPanel', () => {
  let sandbox;
  let dojoServiceMock;
  let projectServiceMock;
  let userServiceMock;
  let adminPanelWithMocks;
  
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    dojoServiceMock = {
      getDojoById: sinon.stub(),
      isGitHubIntegrated: sinon.stub(),
      removeGitHubIntegration: sinon.stub(),
    };
    projectServiceMock = {
      getProjectsForDojo: sinon.stub(),
    };
    userServiceMock = {
      isUserChampion: sinon.stub(),
      isUserCDFAdmin: sinon.stub(),
    };
    adminPanelWithMocks = AdminPanel({
      '@/dojos/service': dojoServiceMock,
      '@/projects/service': projectServiceMock,
      '@/users/service': userServiceMock,
    });
  });
  
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('computed', () => {
    describe('githubAuthUrl', () => {
      it('should return the url to start the GitHub integration flow for this Dojo', () => {
        // ARRANGE
        let adminPanel = vueUnitHelper(AdminPanel());
        adminPanel.githubClientId = '8765-1234';
        adminPanel.$route = {
          params: {
            dojoId: '1234-5678',
          },
        };
        const expectedGitHubAuthUrl = 'https://github.com/login/oauth/authorize?scope=public_repo&client_id=8765-1234&redirect_uri=http://localhost:8080/dojos/integrations/github?dojoId=1234-5678';
        
        // ACT & ASSERT
        expect(adminPanel.githubAuthUrl).to.equal(expectedGitHubAuthUrl);
      });
    });
    describe('paginatedProjectData', () => {
      it('should return the project data for the current page', () => {
        // ARRANGE
        let adminPanel = vueUnitHelper(AdminPanel());
        adminPanel.currentPage = 2;
        adminPanel.projectsPerPage = 6;
        adminPanel.projectData = [
          'Project 1',
          'Project 2',
          'Project 3',
          'Project 4',
          'Project 5',
          'Project 6',
          'Project 7',
          'Project 8',
          'Project 9',
          'Project 10',
        ];
        const expectedPaginatedProjectData = [
          'Project 7',
          'Project 8',
          'Project 9',
          'Project 10',
        ];
        
        // ACT & ASSERT
        expect(adminPanel.paginatedProjectData).to.deep.equal(expectedPaginatedProjectData);
      });
    });
    describe('firstOnPage', () => {
      it('should return the overall number of the first project on the current page', () => {
        // ARRANGE
        let adminPanel = vueUnitHelper(AdminPanel());
        adminPanel.projectsPerPage = 6;
        adminPanel.currentPage = 2;
        
        // ACT & ASSERT
        expect(adminPanel.firstOnPage).to.equal(7);
      });
    });
    describe('lastOnPage', () => {
      it('should return the overall number of the last project on the current page', () => {
        // ARRANGE
        let adminPanel = vueUnitHelper(AdminPanel());
        adminPanel.firstOnPage = 7;
        adminPanel.projectsPerPage = 6;
        adminPanel.projectData = [
          'Project 1',
          'Project 2',
          'Project 3',
          'Project 4',
          'Project 5',
          'Project 6',
          'Project 7',
          'Project 8',
          'Project 9',
          'Project 10',
          'Project 11',
          'Project 12',
          'Project 13',
        ];
        
        // ACT & ASSERT
        expect(adminPanel.lastOnPage).to.equal(12);
      });
      it('should return the overall number of the last project when on the last page', () => {
        // ARRANGE
        let adminPanel = vueUnitHelper(AdminPanel());
        adminPanel.firstOnPage = 7;
        adminPanel.projectsPerPage = 6;
        adminPanel.projectData = [
          'Project 1',
          'Project 2',
          'Project 3',
          'Project 4',
          'Project 5',
          'Project 6',
          'Project 7',
          'Project 8',
          'Project 9',
          'Project 10',
        ];
        
        // ACT & ASSERT
        expect(adminPanel.lastOnPage).to.equal(10);
      });
    });
  });
  
  describe('methods', () => {
    describe('viewDojo', () => {
      it('should redirect the user to the Dojo details page for this Dojo', () => {
        // ARRANGE
        let adminPanel = vueUnitHelper(adminPanelWithMocks);
        adminPanel.$route = {
          params: {
            dojoId: '1234-5678',
          },
        };
        adminPanel.$router = {
          push: sandbox.spy(),
        };
        
        // ACT
        adminPanel.viewDojo();
        
        // ASSERT
        expect(adminPanel.$router.push).to.have.been.calledWith('/dojos/1234-5678');
      });
    });
    describe('editProject', () => {
      it('should redirect the user to edit the project with the given project id', () => {
        // ARRANGE
        let adminPanel = vueUnitHelper(adminPanelWithMocks);
        const projectIdMock = '5678-1234';
        adminPanel.$router = {
          push: sandbox.spy(),
        };
        
        // ACT
        adminPanel.editProject('5678-1234');
        
        // ASSERT
        expect(adminPanel.$router.push).to.have.been.calledWith('/edit-project/5678-1234');
      });
    });
    describe('removeGitHubIntegration', () => {
      it('should make the API call to remove the GitHub integration from this Dojo and then refresh the page', async () => {
        // ARRANGE
        let adminPanel = vueUnitHelper(adminPanelWithMocks);
        const dojoIdMock = '1234-5678';
        adminPanel.removingGitHubIntegration = false;
        dojoServiceMock.removeGitHubIntegration.withArgs(dojoIdMock).resolves('');
        adminPanel.$route = {
          params: {
            dojoId: dojoIdMock,
          },
        };
        adminPanel.$router = {
          go: sandbox.spy(),
        };
        
        // ACT
        await adminPanel.removeGitHubIntegration();
        
        // ASSERT
        expect(adminPanel.removingGitHubIntegration).to.be.true;
        expect(dojoServiceMock.removeGitHubIntegration).to.have.been.calledWith(dojoIdMock);
        expect(adminPanel.$router.go).to.have.been.calledOnce;
      });
      it('should not do anything if already removing the GitHub integration', async () => {
        // ARRANGE
        let adminPanel = vueUnitHelper(adminPanelWithMocks);
        adminPanel.removingGitHubIntegration = true;
        adminPanel.$router = {
          go: sandbox.spy(),
        };
        
        // ACT
        await adminPanel.removeGitHubIntegration();
        
        // ASSERT
        expect(adminPanel.removingGitHubIntegration).to.be.true;
        expect(dojoServiceMock.removeGitHubIntegration).to.not.have.been.called;
        expect(adminPanel.$router.go).to.not.have.been.called;
      });
    });
  });
  
  describe('created', () => {
    it('should check if the user is champion of the dojo or CDF Admin, get dojo and project data, check if GitHub is integrated and register pagination event handler', async () => {
      // ARRANGE
      let adminPanel = vueUnitHelper(adminPanelWithMocks);
      const isUserChampionMock = {
        body: true,
      };
      const isUserCDFAdminMock = {
        body: false,
      };
      const dojoDataMock = {
        body: 'expectedDojoData',
      };
      const isGitHubIntegratedMock = {
        body: true,
      };
      const projectDataMock = {
        body: 'expectedProjectData',
      };
      adminPanel.$route = {
        params: {
          dojoId: '1234-5678',
        },
      };
      adminPanel.$router = {
        push: sandbox.spy(),
      };
      adminPanel.$cookie = {
        get: sandbox.stub(),
      };
      adminPanel.$cookie.get.withArgs('loggedIn').returns('4321-5678');
      userServiceMock.isUserChampion.withArgs('4321-5678', '1234-5678').resolves(isUserChampionMock);
      userServiceMock.isUserCDFAdmin.withArgs('4321-5678').resolves(isUserCDFAdminMock);
      dojoServiceMock.getDojoById.withArgs('1234-5678').resolves(dojoDataMock);
      dojoServiceMock.isGitHubIntegrated.withArgs('1234-5678').resolves(isGitHubIntegratedMock);
      projectServiceMock.getProjectsForDojo.withArgs('1234-5678', true).resolves(projectDataMock);
      
      // ACT
      await adminPanel.$lifecycleMethods.created();
      
      // ASSERT
      expect(adminPanel.$cookie.get).to.have.been.calledWith('loggedIn');
      expect(userServiceMock.isUserChampion).to.have.been.calledWith('4321-5678', '1234-5678');
      expect(adminPanel.isLoggedInUserChampion).to.be.true;
      expect(userServiceMock.isUserCDFAdmin).to.have.been.calledWith('4321-5678');
      expect(adminPanel.isLoggedInUserCDFAdmin).to.be.false;
      expect(adminPanel.$router.push).to.not.have.been.called;
      expect(dojoServiceMock.getDojoById).to.have.been.calledWith('1234-5678');
      expect(adminPanel.dojoData).to.equal(dojoDataMock.body);
      expect(dojoServiceMock.isGitHubIntegrated).to.have.been.calledWith('1234-5678');
      expect(adminPanel.isGitHubIntegrated).to.be.true;
      expect(projectServiceMock.getProjectsForDojo).to.have.been.calledWith('1234-5678', true);
      expect(adminPanel.projectData).to.equal(projectDataMock.body);
      expect(adminPanel.fullProjectData).to.equal(adminPanel.projectData);
    });
    it('should redirect the user away if they are not a champion of this Dojo or a CDF Admin', async () => {
      // ARRANGE
      let adminPanel = vueUnitHelper(adminPanelWithMocks);
      const isUserChampionMock = {
        body: false,
      };
      const isUserCDFAdminMock = {
        body: false,
      };
      const dojoDataMock = {
        body: 'expectedDojoData',
      };
      const isGitHubIntegratedMock = {
        body: true,
      };
      const projectDataMock = {
        body: 'expectedProjectData',
      };
      adminPanel.$route = {
        params: {
          dojoId: '1234-5678',
        },
      };
      adminPanel.$router = {
        push: sandbox.spy(),
      };
      adminPanel.$cookie = {
        get: sandbox.stub(),
      };
      adminPanel.$cookie.get.withArgs('loggedIn').returns('1234-8765');
      userServiceMock.isUserChampion.withArgs('1234-8765', '1234-5678').resolves(isUserChampionMock);
      userServiceMock.isUserCDFAdmin.withArgs('1234-8765').resolves(isUserCDFAdminMock);
      dojoServiceMock.getDojoById.withArgs('1234-5678').resolves(dojoDataMock);
      dojoServiceMock.isGitHubIntegrated.withArgs('1234-5678').resolves(isGitHubIntegratedMock);
      projectServiceMock.getProjectsForDojo.withArgs('1234-5678', true).resolves(projectDataMock);
      
      // ACT
      await adminPanel.$lifecycleMethods.created();
      
      // ASSERT
      expect(userServiceMock.isUserChampion).to.have.been.calledWith('1234-8765', '1234-5678');
      expect(adminPanel.isLoggedInUserChampion).to.be.false;
      expect(userServiceMock.isUserCDFAdmin).to.have.been.calledWith('1234-8765');
      expect(adminPanel.isLoggedInUserCDFAdmin).to.be.false;
      expect(adminPanel.$router.push).to.have.been.calledWith('/');
    });
    it('should not get project data if GitHub is not integrated', async () => {
      // ARRANGE
      let adminPanel = vueUnitHelper(adminPanelWithMocks);
      const isUserChampionMock = {
        body: true,
      };
      const isUserCDFAdminMock = {
        body: false,
      };
      const dojoDataMock = {
        body: 'expectedDojoData',
      };
      const isGitHubIntegratedMock = {
        body: false,
      };
      adminPanel.$route = {
        params: {
          dojoId: '1234-5678',
        },
      };
      adminPanel.$router = {
        push: sandbox.spy(),
      };
      adminPanel.$cookie = {
        get: sandbox.stub(),
      };
      adminPanel.$cookie.get.withArgs('loggedIn').returns('4321-5678');
      userServiceMock.isUserChampion.withArgs('4321-5678', '1234-5678').resolves(isUserChampionMock);
      userServiceMock.isUserCDFAdmin.withArgs('4321-5678').resolves(isUserCDFAdminMock);
      dojoServiceMock.getDojoById.withArgs('1234-5678').resolves(dojoDataMock);
      dojoServiceMock.isGitHubIntegrated.withArgs('1234-5678').resolves(isGitHubIntegratedMock);
      
      // ACT
      await adminPanel.$lifecycleMethods.created();
      
      // ASSERT
      expect(dojoServiceMock.isGitHubIntegrated).to.have.been.calledWith('1234-5678');
      expect(adminPanel.isGitHubIntegrated).to.be.false;
      expect(projectServiceMock.getProjectsForDojo).to.not.have.been.called;
      expect(adminPanel.projectData).to.equal(null);
      expect(adminPanel.fullProjectData).to.equal(null);
    });
  });
  
  describe('watch', () => {
    describe('searchQuery', () => {
      it('should filter project data based on the new search query', () => {
        // ARRANGE
        let adminPanel = vueUnitHelper(AdminPanel());
        adminPanel.$refs = {
          pagination: {
            setPage: sandbox.spy(),
          },
        };
        const fullProjectDataMock = [
          {
            name: 'Chess',
            description: 'A command-line chess game.',
          },
          {
            name: 'Current Date and Time',
            description: 'Displays the current date and time in ISO format.',
          },
          {
            name: 'Django',
            description: 'Testing Django.',
          },
          {
            name: 'Castle Escape',
            description: 'Which way is out?',
          },
          {
            name: 'Square Number',
            description: 'Squares a given number!',
          },
        ];
        const projectDataMock = [
          {
            name: 'Chess',
            description: 'A command-line chess game.',
          },
          {
            name: 'Current Date and Time',
            description: 'Displays the current date and time in ISO format.',
          },
          {
            name: 'Castle Escape',
            description: 'Which way is out?',
          },
        ];
        adminPanel.fullProjectData = fullProjectDataMock;
        adminPanel.projectData = projectDataMock;
        const expectedProjectData = [
          {
            name: 'Chess',
            description: 'A command-line chess game.',
          },
          {
            name: 'Castle Escape',
            description: 'Which way is out?',
          },
        ];
        
        // ACT
        adminPanel.$watchers.searchQuery('ch', 'c');
        
        // ASSERT
        expect(adminPanel.projectData).to.deep.equal(expectedProjectData);
        expect(adminPanel.$refs.pagination.setPage).to.have.been.calledWith(1);
      });
    });
  });
});