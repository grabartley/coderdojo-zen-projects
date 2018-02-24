<template>
  <div class="project-list">
    <h2>All Projects</h2>
    <h3>Python</h3>
    <div v-for="project in pythonProjectData">
      <router-link v-if="!project.deleted_at" :to="{ name: 'ProjectDetails', params: { projectId: project.project_id } }">{{ project.name }}</router-link>
    </div>
    <h3>JavaScript</h3>
    <div v-for="project in javascriptProjectData">
      <router-link v-if="!project.deleted_at" :to="{ name: 'ProjectDetails', params: { projectId: project.project_id } }">{{ project.name }}</router-link>
    </div>
    <h3>HTML/CSS/JavaScript</h3>
    <div v-for="project in htmlProjectData">
      <router-link v-if="!project.deleted_at" :to="{ name: 'ProjectDetails', params: { projectId: project.project_id } }">{{ project.name }}</router-link>
    </div>
    <div class="project-list__footer">
      <router-link v-if="loggedIn" :to="{ name: 'ProjectCreationForm', params: {} }">Create a Project</router-link>
    </div>
  </div>
</template>

<script>
import ProjectCreationForm from '@/components/project-creation-form';
import projectService from '@/projects/service';

export default {
  name: 'ProjectList',
  data() {
    return {
      pythonProjectData: null,
      javascriptProjectData: null,
      htmlProjectData: null,
      loggedIn: false,
    };
  },
  async created() {
    // get the project data to display
    let allProjectData = await projectService.getAllProjectData();
    this.pythonProjectData = allProjectData.body.python;
    this.javascriptProjectData = allProjectData.body.javascript;
    this.htmlProjectData = allProjectData.body.html;
    
    // check if logged in
    this.loggedIn = this.$cookies.get('loggedIn');
  },
}
</script>

<style scoped lang="less">
  .project-list {
    &__footer {
      margin-top: 50px;
    }
  }
</style>