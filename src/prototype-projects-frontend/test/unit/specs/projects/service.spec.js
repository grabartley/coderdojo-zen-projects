import ProjectService from '@/projects/service';
import Vue from 'vue';

describe('ProjectService', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('getAllProjectData', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      sandbox.stub(Vue.http, 'get');
      Vue.http.get.withArgs(`${Vue.config.apiServer}/api/2.0/projects/all-project-data`).returns(Promise.resolve('expectedResponse'));
      
      // ACT
      let result = await ProjectService.getAllProjectData();
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
  describe('createProject', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      sandbox.stub(Vue.http, 'post');
      let fileDataMock = {
        filename: 'test.zip',
      };
      Vue.http.post.withArgs(`${Vue.config.apiServer}/api/2.0/projects/create-project`, fileDataMock).returns(Promise.resolve('expectedResponse'));
      
      // ACT
      let result = await ProjectService.createProject(fileDataMock);
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
});