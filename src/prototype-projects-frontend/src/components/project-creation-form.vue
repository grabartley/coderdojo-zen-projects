<template>
  <div class="project-creation-form">
    <h2>Create a Project</h2>
    <form>
      <project-details-form ref="projectDetailsFormRef"></project-details-form>
      <project-files-form ref="projectFilesFormRef"></project-files-form>
    </form>
    <button @click="createProject()">Create Project</button>
  </div>
</template>
<script>
import ProjectDetailsForm from '@/components/project-details-form';
import ProjectFilesForm from '@/components/project-files-form';
import projectService from '@/projects/service';

export default {
  name: 'ProjectCreationForm',
  components: {
    ProjectDetailsForm,
    ProjectFilesForm,
  },
  methods: {
    // if all form data is valid, send project data to the backend
    createProject() {
      if (this.$refs.projectDetailsFormRef.isValid() && this.$refs.projectFilesFormRef.isValid()) {
        // store information from the form inputs
        this.$refs.projectDetailsFormRef.submitForm();
        this.$refs.projectFilesFormRef.submitForm();
        
        // create data structure for the information
        let projectData = {
          name: window.sessionStorage.getItem('projectName'),
          type: window.sessionStorage.getItem('projectType'),
          main: window.sessionStorage.getItem('projectMain'),
          description: window.sessionStorage.getItem('projectDescription'),
          filename: window.sessionStorage.getItem('filename'),
          file: window.sessionStorage.getItem('projectFiles'),
          userId: this.$cookies.get('loggedIn'),
          // the same as the logged in user for now (will be champion in future)
          githubUserId: this.$cookies.get('loggedIn'),
        };
        
        // send the project to the backend to save
        projectService.createProject(projectData);
        
        // send the user back to the projects list for now
        this.$router.push('/');
      }
    }
  },
}
</script>
<style scoped lang="less">
</style>