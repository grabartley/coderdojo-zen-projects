import ProjectList from '!!vue-loader?inject!@/components/project-list';
import vueUnitHelper from 'vue-unit-helper';

describe('ProjectList', () => {
  let sandbox;
  let projectServiceMock;
  let projectListWithMocks;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    projectServiceMock = {
      getAllProjectData: sinon.stub(),
    };
    projectListWithMocks = ProjectList({
      '@/projects/service': projectServiceMock,
    });
  });
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('created', () => {
    it('should use the projects service to get all project data and store it as well as check if the user is logged in', async () => {
      // ARRANGE
      let projectList = vueUnitHelper(projectListWithMocks);
      const allProjectDataMock = {
        body: {
          python: [
            {
              id: '1234-5678',
              name: 'Test Project 1',
            }
          ],
          javascript: [
            {
              id: '1235-5678',
              name: 'Test Project 2',
            }
          ],
          html: [
            {
              id: '1236-5678',
              name: 'Test Project 3',
            }
          ],
          java: [
            {
              id: '1236-5678',
              name: 'Test Project 4',
            }
          ],
        }
      };
      const expectedPythonProjectData = [{
        id: '1234-5678',
        name: 'Test Project 1',
      }];
      const expectedJavascriptProjectData = [{
        id: '1235-5678',
        name: 'Test Project 2',
      }];
      const expectedHtmlProjectData = [{
        id: '1236-5678',
        name: 'Test Project 3',
      }];
      const expectedJavaProjectData = [{
        id: '1236-5678',
        name: 'Test Project 4',
      }];
      projectServiceMock.getAllProjectData.returns(Promise.resolve(allProjectDataMock));
      projectList.$cookies = {
        get: () => '2234-5678'
      };
      sandbox.spy(projectList.$cookies, 'get');
      
      // ACT
      await projectList.$lifecycleMethods.created();
      
      // ASSERT
      expect(projectServiceMock.getAllProjectData).to.have.been.calledOnce;
      expect(projectList.pythonProjectData).to.deep.equal(expectedPythonProjectData);
      expect(projectList.javascriptProjectData).to.deep.equal(expectedJavascriptProjectData);
      expect(projectList.htmlProjectData).to.deep.equal(expectedHtmlProjectData);
      expect(projectList.javaProjectData).to.deep.equal(expectedJavaProjectData);
      expect(projectList.loggedIn).to.equal('2234-5678');
    });
  });
});