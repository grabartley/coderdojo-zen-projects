import Vue from 'vue';

const projectService = {
  // returns project data for the given project id
  getProjectById: projectId => Vue.http.get(`${Vue.config.apiServer}/api/2.0/projects/project/${projectId}`),
  // returns project statistics for the given project id
  getProjectStatisticsById: projectId => Vue.http.get(`${Vue.config.apiServer}/api/2.0/projects/project-statistics/${projectId}`),
  // returns project data based on given params
  getProjectData: (deleted, sortedBy, sortOrder, limit) => Vue.http.get(`${Vue.config.apiServer}/api/2.0/projects/project-data?deleted=${deleted}&sortedBy=${sortedBy}&sortOrder=${sortOrder}&limit=${limit}`),
  // returns projects for the Dojo with the given Dojo id
  getProjectsForDojo: (dojoId, deleted) => Vue.http.get(`${Vue.config.apiServer}/api/2.0/projects/projects-for-dojo/${dojoId}?deleted=${deleted}`),
  // returns projects for the user with the given user id
  getProjectsForUser: userId => Vue.http.get(`${Vue.config.apiServer}/api/2.0/projects/projects-for-user/${userId}`),
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