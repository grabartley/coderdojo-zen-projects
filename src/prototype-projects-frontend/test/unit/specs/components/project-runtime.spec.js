import ProjectRuntime from '!!vue-loader?inject!@/components/project-runtime';
import vueUnitHelper from 'vue-unit-helper';

describe('ProjectRuntime', () => {
  let sandbox;
  let projectServiceMock;
  let projectRuntimeMock;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    projectServiceMock = {
      getProjectById: sinon.stub(),
      incrementProjectPlays: sinon.stub(),
    };
    projectRuntimeMock = ProjectRuntime({
      '@/projects/service': projectServiceMock,
    });
  });
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('methods', () => {
    describe('runProject', () => {
      it('should set up the terminal and emit the start event', () => {
        // ARRANGE
        let projectRuntime = vueUnitHelper(ProjectRuntime());
        const divMock = document.createElement('div');
        const projectDataMock = {
          project_id: '5678-1234',
          name: 'Test Project',
          type: 'python',
          entrypoint: 'TestProject.py',
          description: 'A project for testing.',
          github: null,
          created_at: '2018-02-21T16:02:14.821Z',
          updated_at: null,
          author: null,
          user_id: '1234-5678',
          github_integration_id: '8765-4321',
          deleted_at: null
        };
        projectRuntime.projectData = projectDataMock;
        projectRuntime.term = null;
        projectRuntime.projectRunning = false;
        projectRuntime.$refs = {
          terminal: divMock,
        };
        projectRuntime.$socket = {
          emit: () => null,
        };
        sandbox.spy(projectRuntime.$socket, 'emit');
        
        // ACT
        projectRuntime.runProject();
        
        // ASSERT
        expect(projectRuntime.projectRunning).to.equal(true);
        expect(projectRuntime.$socket.emit).to.have.been.calledWith('start', projectDataMock.project_id);
      });
    });
  });
  
  describe('created', () => {
    it('should get the project data, call runProject() and increment the plays', async () => {
      // ARRANGE
      let projectRuntime = vueUnitHelper(projectRuntimeMock);
      const divMock = document.createElement('div');
      projectRuntime.$route = {
        params: {
          projectId: '1234-5678',
        },
      };
      projectRuntime.$refs = {
        terminal: divMock,
      };
      projectRuntime.$socket = {
        emit: () => null,
      };
      projectRuntime.$router = {
        push: () => null,
      };
      const projectDataMock = {
        body: {
          project_id: '1234-5678',
          name: 'Test Project',
          type: 'python',
          entrypoint: 'TestProject.py',
          description: 'A project for testing.',
          github: null,
          created_at: '2018-02-21T16:02:14.821Z',
          updated_at: null,
          author: null,
          user_id: '5432-1678',
          github_integration_id: '8765-4321',
          deleted_at: null
        },
      };
      projectServiceMock.getProjectById.withArgs('1234-5678').returns(Promise.resolve(projectDataMock));
      projectServiceMock.incrementProjectPlays.withArgs('1234-5678').returns(Promise.resolve());
      sandbox.spy(projectRuntime, 'runProject');
      sandbox.spy(projectRuntime.$router, 'push');
      
      // ACT
      await projectRuntime.$lifecycleMethods.created();
      
      // ASSERT
      expect(projectRuntime.projectData).to.equal(projectDataMock.body);
      expect(projectRuntime.runProject).to.have.been.calledOnce;
      expect(projectServiceMock.incrementProjectPlays).to.have.been.calledWith('1234-5678');
      expect(projectRuntime.$router.push).to.not.have.been.called;
    });
    it('should not allow HTML5 projects', async () => {
      // ARRANGE
      let projectRuntime = vueUnitHelper(projectRuntimeMock);
      const divMock = document.createElement('div');
      projectRuntime.$route = {
        params: {
          projectId: '1234-5678',
        },
      };
      projectRuntime.$refs = {
        terminal: divMock,
      };
      projectRuntime.$socket = {
        emit: () => null,
      };
      projectRuntime.$router = {
        push: () => null,
      };
      const projectDataMock = {
        body: {
          project_id: '5678-1234',
          name: 'Test Project',
          type: 'html',
          entrypoint: 'index.html',
          description: 'A project for testing.',
          github: null,
          created_at: '2018-02-21T16:02:14.821Z',
          updated_at: null,
          author: null,
          user_id: '1234-5678',
          github_integration_id: '8765-4321',
          deleted_at: null
        },
      };
      projectServiceMock.getProjectById.withArgs('1234-5678').returns(Promise.resolve(projectDataMock));
      sandbox.spy(projectRuntime, 'runProject');
      sandbox.spy(projectRuntime.$router, 'push');
      
      // ACT
      await projectRuntime.$lifecycleMethods.created();
      
      // ASSERT
      expect(projectRuntime.projectData).to.equal(projectDataMock.body);
      expect(projectRuntime.runProject).to.not.have.been.called;
      expect(projectRuntime.$router.push).to.have.been.calledWith('/');
    });
  });
  
  describe('destroyed', () => {
    it('should emit a stop event to the server', () => {
      // ARRANGE
      let projectRuntime = vueUnitHelper(ProjectRuntime());
      projectRuntime.$socket = {
        emit: () => null,
      };
      sandbox.spy(projectRuntime.$socket, 'emit');
      
      // ACT
      projectRuntime.$lifecycleMethods.destroyed();
      
      // ASSERT
      expect(projectRuntime.$socket.emit).to.have.been.calledWith('stop');
    });
  });
});