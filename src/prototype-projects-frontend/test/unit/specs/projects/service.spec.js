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
  
  describe('getProjectById', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      const projectIdMock = '1234-5678';
      sandbox.stub(Vue.http, 'get');
      Vue.http.get.withArgs(`${Vue.config.apiServer}/api/2.0/projects/project/${projectIdMock}`).returns(Promise.resolve('expectedResponse'));
      
      // ACT
      const result = await ProjectService.getProjectById(projectIdMock);
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
  describe('getProjectStatisticsById', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      const projectIdMock = '1234-5678';
      sandbox.stub(Vue.http, 'get');
      Vue.http.get.withArgs(`${Vue.config.apiServer}/api/2.0/projects/project-statistics/${projectIdMock}`).returns(Promise.resolve('expectedResponse'));
      
      // ACT
      const result = await ProjectService.getProjectStatisticsById(projectIdMock);
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
  describe('getProjectData', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      const deletedMock = false;
      const sortedByMock = 'plays';
      const sortOrderMock = 'desc';
      const limitMock = 5;
      sandbox.stub(Vue.http, 'get');
      Vue.http.get.withArgs(`${Vue.config.apiServer}/api/2.0/projects/project-data?deleted=${deletedMock}&sortedBy=${sortedByMock}&sortOrder=${sortOrderMock}&limit=${limitMock}`).returns(Promise.resolve('expectedResponse'));
      
      // ACT
      const result = await ProjectService.getProjectData(deletedMock, sortedByMock, sortOrderMock, limitMock);
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
  describe('getProjectsForDojo', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      sandbox.stub(Vue.http, 'get');
      const dojoIdMock = '5678-1234';
      const deletedMock = false;
      Vue.http.get.withArgs(`${Vue.config.apiServer}/api/2.0/projects/projects-for-dojo/${dojoIdMock}?deleted=${deletedMock}`).returns(Promise.resolve('expectedResponse'));
      
      // ACT
      const result = await ProjectService.getProjectsForDojo(dojoIdMock, deletedMock);
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
  describe('createProject', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      sandbox.stub(Vue.http, 'post');
      const fileDataMock = {
        filename: 'test.zip',
      };
      Vue.http.post.withArgs(`${Vue.config.apiServer}/api/2.0/projects/create-project`, fileDataMock).returns(Promise.resolve('expectedResponse'));
      
      // ACT
      const result = await ProjectService.createProject(fileDataMock);
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
  describe('updateProject', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      sandbox.stub(Vue.http, 'post');
      const projectDataMock = {
        file: 'fileData',
      };
      Vue.http.post.withArgs(`${Vue.config.apiServer}/api/2.0/projects/update-project`, projectDataMock).returns(Promise.resolve('expectedResponse'));
      
      // ACT
      const result = await ProjectService.updateProject(projectDataMock);
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
  describe('incrementProjectPlays', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      sandbox.stub(Vue.http, 'post');
      const projectIdMock = '1234-5678';
      Vue.http.post.withArgs(`${Vue.config.apiServer}/api/2.0/projects/increment-project-plays`, {projectId: projectIdMock}).returns(Promise.resolve('expectedResponse'));
      
      // ACT
      const result = await ProjectService.incrementProjectPlays(projectIdMock);
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
  describe('deleteProjectById', () => {
    it('should make the correct API call', async () => {
      // ARRANGE
      sandbox.stub(Vue.http, 'post');
      const projectIdMock = '1234-5678';
      Vue.http.post.withArgs(`${Vue.config.apiServer}/api/2.0/projects/delete-project`, {projectId: projectIdMock}).returns(Promise.resolve('expectedResponse'));
      
      // ACT
      const result = await ProjectService.deleteProjectById(projectIdMock);
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
});