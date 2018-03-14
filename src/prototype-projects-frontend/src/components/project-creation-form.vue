<template>
  <div class="project-creation-form">
    <div class="project-creation-form__header">
      <span class="project-creation-form__header-image">
        <img src="@/assets/cd-logo.png" alt="CoderDojo Logo"></img>
      </span>
      <span class="project-creation-form__header-title">
        New Project
      </span>
    </div>
    <div class="project-creation-form__content">
      <form>
        <project-details-form ref="projectDetailsFormRef"></project-details-form>
        <project-files-form ref="projectFilesFormRef"></project-files-form>
      </form>
      <button class="project-creation-form__content-button primary-button" @click="createProject()">Create Project</button>
    </div>
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
          entrypoint: window.sessionStorage.getItem('projectEntrypoint'),
          description: window.sessionStorage.getItem('projectDescription'),
          dojoId: window.sessionStorage.getItem('dojoId'),
          filename: window.sessionStorage.getItem('filename'),
          file: window.sessionStorage.getItem('projectFiles'),
          userId: this.$cookies.get('loggedIn'),
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
  .project-creation-form {
    &__header {
      display: flex;
      padding: 15px 20px;
      margin-bottom: 30px;
      background-color: #73449B;
      align-items: center;
      &-image img {
        width: 65px;
        height: 65px;
      }
      &-title {
        margin-left: 16px;
        color: white;
        font-size: 30px;
      }
    }
    &__content {
      &-button {
        margin: 20px 0;
      }
    }
  }
</style>