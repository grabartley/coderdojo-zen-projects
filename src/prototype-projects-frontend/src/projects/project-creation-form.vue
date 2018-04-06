<template>
  <div class="project-creation-form">
    <div class="project-creation-form__banner">
      <span class="project-creation-form__banner-image">
        <img src="@/assets/cd-logo.png" alt="CoderDojo Logo"></img>
      </span>
      <span class="project-creation-form__banner-title">New Project</span>
    </div>
    <div class="project-creation-form__content">
      <form>
        <project-details-form ref="projectDetailsFormRef"></project-details-form>
        <project-files-form ref="projectFilesFormRef"></project-files-form>
      </form>
      <button class="project-creation-form__content-button primary-button" v-bind:class="{'project-creation-form__content-button-spinning': creatingProject}" @click="createProject()">
        <span v-if="creatingProject" class="fa fa-spinner fa-spin"></span>
        <span v-else>Create Project</span>
      </button>
    </div>
  </div>
</template>
<script>
import ProjectDetailsForm from '@/projects/project-details-form';
import ProjectFilesForm from '@/projects/project-files-form';
import projectService from '@/projects/service';

export default {
  name: 'ProjectCreationForm',
  data() {
    return {
      creatingProject: false,
    };
  },
  components: {
    ProjectDetailsForm,
    ProjectFilesForm,
  },
  methods: {
    // if all form data is valid and we're not already creating a project, create the project
    async createProject() {
      if (this.$refs.projectDetailsFormRef.isValid() && this.$refs.projectFilesFormRef.isValid() && !this.creatingProject) {
        // a project is being created
        this.creatingProject = true;
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
          resourceUrl: window.sessionStorage.getItem('projectResource'),
          filename: window.sessionStorage.getItem('filename'),
          file: window.sessionStorage.getItem('projectFiles'),
          userId: this.$cookies.get('loggedIn'),
        };
        
        // send the project to the backend to save
        await projectService.createProject(projectData);
        
        // send the user back to the projects list for now
        this.$router.push('/');
      }
    }
  },
}
</script>
<style scoped lang="less">
  .project-creation-form {
    &__banner {
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
        &-spinning {
          font-size: 16px;
          width: 50px;
          transition: 0.3s;
        }
      }
    }
  }
</style>