import ProjectList from '!!vue-loader?inject!@/components/project-list';
import vueUnitHelper from 'vue-unit-helper';

describe('ProjectList', () => {
  let sandbox;
  let vuePagination2Mock;
  let projectServiceMock;
  let projectListWithMocks;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    vuePagination2Mock = {
      Pagination: {},
      PaginationEvent: {
        $on: sinon.stub(),
      },
    };
    projectServiceMock = {
      getProjectData: sinon.stub(),
    };
    projectListWithMocks = ProjectList({
      'vue-pagination-2': vuePagination2Mock,
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
        let projectList = vueUnitHelper(ProjectList());
        projectList.currentPage = 2;
        projectList.projectsPerPage = 6;
        projectList.projectData = [
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
        expect(projectList.paginatedProjectData).to.deep.equal(expectedPaginatedProjectData);
      });
    });
    describe('firstOnPage', () => {
      it('should return the overall number of the first project on the current page', () => {
        // ARRANGE
        let projectList = vueUnitHelper(ProjectList());
        projectList.projectsPerPage = 6;
        projectList.currentPage = 2;
        
        // ACT & ASSERT
        expect(projectList.firstOnPage).to.equal(7);
      });
    });
    describe('lastOnPage', () => {
      it('should return the overall number of the last project on the current page', () => {
        // ARRANGE
        let projectList = vueUnitHelper(ProjectList());
        projectList.firstOnPage = 7;
        projectList.projectsPerPage = 6;
        projectList.projectData = [
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
        expect(projectList.lastOnPage).to.equal(12);
      });
      it('should return the overall number of the last project when on the last page', () => {
        // ARRANGE
        let projectList = vueUnitHelper(ProjectList());
        projectList.firstOnPage = 7;
        projectList.projectsPerPage = 6;
        projectList.projectData = [
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
        expect(projectList.lastOnPage).to.equal(10);
      });
    });
  });
  
  describe('methods', () => {
    describe('createProject', () => {
      it('should redirect the user to the Project Creation Form', () => {
        // ARRANGE
        let projectList = vueUnitHelper(ProjectList());
        projectList.$router = {
          push: sandbox.spy(),
        };
        
        // ACT
        projectList.createProject();
        
        // ASSERT
        expect(projectList.$router.push).to.have.been.calledWith('/create-project');
      });
    });
  });
  
  describe('created', () => {
    it('should get project data, check if the user is logged in and set up the pagination event handler', async () => {
      // ARRANGE
      let projectList = vueUnitHelper(projectListWithMocks);
      const projectDataResponseMock = {
        body: 'projectData',
      };
      const mostPlayedProjectsResponseMock = {
        body: 'mostPlayedProjects',
      };
      const recentlyUpdatedProjectsResponseMock = {
        body: 'recentlyUpdatedProjects',
      };
      const newlyCreatedProjectsResponseMock = {
        body: 'newlyCreatedProjects',
      };
      projectServiceMock.getProjectData.withArgs().returns(projectDataResponseMock);
      projectServiceMock.getProjectData.withArgs(false, 'plays', 'desc', 5).returns(mostPlayedProjectsResponseMock);
      projectServiceMock.getProjectData.withArgs(false, 'updated_at', 'desc', 5).returns(recentlyUpdatedProjectsResponseMock);
      projectServiceMock.getProjectData.withArgs(false, 'created_at', 'desc', 5).returns(newlyCreatedProjectsResponseMock);
      projectList.$cookies = {
        get: sandbox.stub(),
      };
      projectList.$cookies.get.withArgs('loggedIn').returns(true);
      
      // ACT
      await projectList.$lifecycleMethods.created();
      
      // ASSERT
      expect(projectServiceMock.getProjectData).to.have.callCount(4);
      expect(projectList.projectData).to.equal('projectData');
      expect(projectList.mostPlayedProjects).to.equal('mostPlayedProjects');
      expect(projectList.recentlyUpdatedProjects).to.equal('recentlyUpdatedProjects');
      expect(projectList.newlyCreatedProjects).to.equal('newlyCreatedProjects');
      expect(projectList.$cookies.get).to.have.been.calledWith('loggedIn');
      expect(projectList.loggedIn).to.be.true;
      expect(vuePagination2Mock.PaginationEvent.$on).to.have.been.calledOnce;
    });
  });
});