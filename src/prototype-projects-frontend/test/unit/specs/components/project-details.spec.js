import ProjectDetails from '!!vue-loader?inject!@/components/project-details';
import vueUnitHelper from 'vue-unit-helper';

describe('ProjectDetails', () => {
  let sandbox;
  let projectServiceMock;
  let projectDetailsWithMocks;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    projectServiceMock = {
      getProjectById: sinon.stub(),
    };
    projectDetailsWithMocks = ProjectDetails({
      '@/projects/service': projectServiceMock,
    });
  });
  afterEach(() => {
    sandbox.restore();
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
    it('should get the data for this project and check if the logged in user owns it', async () => {
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
      projectDetails.$route = {
        params: {
          projectId: projectIdMock,
        },
      };
      projectDetails.$cookies = {
        get: (cookieName) => '4567-1238'
      };
      projectServiceMock.getProjectById.withArgs(projectIdMock).returns(Promise.resolve(projectDataMock));
      
      // ACT
      await projectDetails.$lifecycleMethods.created();
      
      // ASSERT
      expect(projectDetails.projectData).to.equal(projectDataMock.body);
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