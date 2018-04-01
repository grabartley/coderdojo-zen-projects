import Vue from 'vue';

const projectService = {
  // returns project data for the given project id
  getProjectById: projectId => Vue.http.get(`${Vue.config.apiServer}/api/2.0/projects/project/${projectId}`),
  // returns project statistics for the given project id
  getProjectStatisticsById: projectId => Vue.http.get(`${Vue.config.apiServer}/api/2.0/projects/project-statistics/${projectId}`),
  // returns project data
  getProjectData: (deleted, sortedBy, sortOrder, limit) => Vue.http.get(`${Vue.config.apiServer}/api/2.0/projects/project-data?deleted=${deleted}&sortedBy=${sortedBy}&sortOrder=${sortOrder}&limit=${limit}`),
  // creates a new project
  createProject: fileData => Vue.http.post(`${Vue.config.apiServer}/api/2.0/projects/create-project`, fileData),
  // updates a project with the given projectData
  updateProject: projectData => Vue.http.post(`${Vue.config.apiServer}/api/2.0/projects/update-project`, projectData),
  // increments the plays for the project with the given project id
  incrementProjectPlays: projectId => Vue.http.post(`${Vue.config.apiServer}/api/2.0/projects/increment-project-plays`, {projectId: projectId}),
  // deletes a project given it's id
  deleteProjectById: projectId => Vue.http.post(`${Vue.config.apiServer}/api/2.0/projects/delete-project`, {projectId: projectId}),
};

export default projectService;