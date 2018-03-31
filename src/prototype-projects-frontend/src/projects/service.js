import Vue from 'vue';

const projectService = {
  // returns project data for the given project id
  getProjectById: projectId => Vue.http.get(`${Vue.config.apiServer}/api/2.0/projects/project/${projectId}`),
  // returns project data
  getProjectData: (deleted, sortedBy, sortOrder, limit) => Vue.http.get(`${Vue.config.apiServer}/api/2.0/projects/project-data?deleted=${deleted}&sortedBy=${sortedBy}&sortOrder=${sortOrder}&limit=${limit}`),
  // creates a new project
  createProject: fileData => Vue.http.post(`${Vue.config.apiServer}/api/2.0/projects/create-project`, fileData),
  // updates a project with the given projectData
  updateProject: projectData => Vue.http.post(`${Vue.config.apiServer}/api/2.0/projects/update-project`, projectData),
  // deletes a project given it's id
  deleteProjectById: projectId => Vue.http.post(`${Vue.config.apiServer}/api/2.0/projects/delete-project`, {projectId: projectId}),
};

export default projectService;