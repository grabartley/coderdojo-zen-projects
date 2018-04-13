import DojoDetails from '!!vue-loader?inject!@/dojos/dojo-details';
import vueUnitHelper from 'vue-unit-helper';

describe('DojoDetails', () => {
  let sandbox;
  let dojoServiceMock;
  let userServiceMock;
  let projectServiceMock;
  let dojoDetailsWithMocks;
  
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    dojoServiceMock = {
      getDojoById: sinon.stub(),
      isGitHubIntegrated: sinon.stub(),
    };
    userServiceMock = {
      isUserChampion: sinon.stub(),
    };
    projectServiceMock = {
      getProjectsForDojo: sinon.stub(),
    };
    dojoDetailsWithMocks = DojoDetails({
      '@/dojos/service': dojoServiceMock,
      '@/users/service': userServiceMock,
      '@/projects/service': projectServiceMock,
    });
  });
  
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('computed', () => {
    describe('paginatedProjectData', () => {
      it('should return the project data for the current page', () => {
        // ARRANGE
        let dojoDetails = vueUnitHelper(DojoDetails());
        dojoDetails.currentPage = 2;
        dojoDetails.projectsPerPage = 6;
        dojoDetails.projects = [
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
        expect(dojoDetails.paginatedProjectData).to.deep.equal(expectedPaginatedProjectData);
      });
    });
    describe('firstOnPage', () => {
      it('should return the overall number of the first project on the current page', () => {
        // ARRANGE
        let dojoDetails = vueUnitHelper(DojoDetails());
        dojoDetails.projectsPerPage = 6;
        dojoDetails.currentPage = 2;
        
        // ACT & ASSERT
        expect(dojoDetails.firstOnPage).to.equal(7);
      });
    });
    describe('lastOnPage', () => {
      it('should return the overall number of the last project on the current page', () => {
        // ARRANGE
        let dojoDetails = vueUnitHelper(DojoDetails());
        dojoDetails.firstOnPage = 7;
        dojoDetails.projectsPerPage = 6;
        dojoDetails.projects = [
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
        expect(dojoDetails.lastOnPage).to.equal(12);
      });
      it('should return the overall number of the last project when on the last page', () => {
        // ARRANGE
        let dojoDetails = vueUnitHelper(DojoDetails());
        dojoDetails.firstOnPage = 7;
        dojoDetails.projectsPerPage = 6;
        dojoDetails.projects = [
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
        expect(dojoDetails.lastOnPage).to.equal(10);
      });
    });
  });
  
  describe('methods', () => {
    describe('adminPanel', () => {
      it('should redirect the user to the admin panel for this Dojo', () => {
        // ARRANGE
        let dojoDetails = vueUnitHelper(DojoDetails());
        dojoDetails.$router = {
          push: sandbox.spy(),
        };
        dojoDetails.$route = {
          params: {
            dojoId: '1234-5678',
          },
        };
        
        // ACT
        dojoDetails.adminPanel();
        
        // ASSERT
        expect(dojoDetails.$router.push).to.have.been.calledWith('/admin-panel/1234-5678');
      });
    });
  });
  
  describe('created', () => {
    it('should get Dojo and project data, check if GitHub is integrated, check if logged in user is a champion of this Dojo and set up pagination event handler', async () => {
      // ARRANGE
      let dojoDetails = vueUnitHelper(dojoDetailsWithMocks);
      const expectedDojoDataResponse = {
        body: 'expectedDojoData',
      };
      const isGitHubIntegratedResponse = {
        body: true,
      };
      const isLoggedInUserChampionResponse = {
        body: true,
      };
      const expectedProjectsResponse = {
        body: 'expectedProjects',
      };
      dojoDetails.$route = {
        params: {
          dojoId: '1234-5678',
        },
      };
      dojoDetails.$cookie = {
        get: sandbox.stub(),
      };
      dojoDetails.$cookie.get.withArgs('loggedIn').returns('5678-1234');
      dojoServiceMock.getDojoById.withArgs('1234-5678').returns(Promise.resolve(expectedDojoDataResponse));
      dojoServiceMock.isGitHubIntegrated.withArgs('1234-5678').returns(Promise.resolve(isGitHubIntegratedResponse));
      userServiceMock.isUserChampion.withArgs('5678-1234', '1234-5678').returns(Promise.resolve(isLoggedInUserChampionResponse));
      projectServiceMock.getProjectsForDojo.withArgs('1234-5678', false).returns(Promise.resolve(expectedProjectsResponse));
      
      // ACT
      await dojoDetails.$lifecycleMethods.created();
      
      // ASSERT
      expect(dojoServiceMock.getDojoById).to.have.been.calledWith('1234-5678');
      expect(dojoServiceMock.isGitHubIntegrated).to.have.been.calledWith('1234-5678');
      expect(userServiceMock.isUserChampion).to.have.been.calledWith('5678-1234', '1234-5678');
      expect(dojoDetails.dojoData).to.equal('expectedDojoData');
      expect(dojoDetails.isGitHubIntegrated).to.be.true;
      expect(dojoDetails.isLoggedInUserChampion).to.be.true;
      expect(dojoDetails.projects).to.equal('expectedProjects');
      expect(dojoDetails.fullProjectData).to.equal(dojoDetails.projects);
    });
  });
  
  describe('watch', () => {
    describe('searchQuery', () => {
      it('should filter project data based on the new search query', () => {
        // ARRANGE
        let dojoDetails = vueUnitHelper(DojoDetails());
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
        const projectsMock = [
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
        dojoDetails.fullProjectData = fullProjectDataMock;
        dojoDetails.projects = projectsMock;
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
        dojoDetails.$watchers.searchQuery('ch', 'c');
        
        // ASSERT
        expect(dojoDetails.projects).to.deep.equal(expectedProjectData);
      });
    });
  });
});