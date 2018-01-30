import Vue from 'vue';

const projectService = {
  // returns all project data
  getAllProjectData: () => Vue.http.get(`${Vue.config.apiServer}/api/2.0/projects/all-project-data`),
  // creates a new project
  createProject: fileData => Vue.http.post(`${Vue.config.apiServer}/api/2.0/projects/create-project`, fileData),
};

export default projectService;