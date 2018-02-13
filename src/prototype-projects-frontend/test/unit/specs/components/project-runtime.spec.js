import ProjectRuntime from '@/components/project-runtime';
import vueUnitHelper from 'vue-unit-helper';

describe('ProjectRuntime', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('methods', () => {
    describe('runProject', () => {
      it('should set up the terminal and emit the start event', () => {
        // ARRANGE
        let projectRuntime = vueUnitHelper(ProjectRuntime);
        let divMock = document.createElement('div');
        let projectIdMock = '1234-5678';
        projectRuntime.projectId = projectIdMock;
        projectRuntime.term = null;
        projectRuntime.projectRunning = false;
        projectRuntime.$refs = {
          overlay: {
            style: {
              visibility: 'visible',
              opacity: '0.9',
            }  
          }, terminal: divMock,
        };
        projectRuntime.$socket = {
          emit: () => null,
        };
        sandbox.spy(projectRuntime.$socket, 'emit');
        
        // ACT
        projectRuntime.runProject();
        
        // ASSERT
        expect(projectRuntime.$refs.overlay.style.visibility).to.equal('hidden');
        expect(projectRuntime.$refs.overlay.style.opacity).to.equal('1');
        expect(projectRuntime.projectRunning).to.equal(true);
        expect(projectRuntime.$socket.emit).to.have.been.calledWith('start', projectIdMock);
      });
    });
  });
  
  describe('created', () => {
    it('should get the project id from the route params', () => {
      // ARRANGE
      let projectRuntime = vueUnitHelper(ProjectRuntime);
      projectRuntime.$route = {
        params: {
          id: '1234-5678',
        },
      };
      
      // ACT
      projectRuntime.$lifecycleMethods.created();
      
      // ASSERT
      expect(projectRuntime.projectId).to.equal('1234-5678');
    });
  });
});