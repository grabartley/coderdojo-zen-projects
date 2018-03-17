<template>
  <div class="project-list">
    <h2>All Projects</h2>
    <h3>Python 3</h3>
    <div v-for="project in pythonProjectData">
      <router-link v-if="!project.deleted_at" :to="{ name: 'ProjectDetails', params: { projectId: project.project_id } }">{{ project.name }}</router-link>
    </div>
    <h3>NodeJS</h3>
    <div v-for="project in javascriptProjectData">
      <router-link v-if="!project.deleted_at" :to="{ name: 'ProjectDetails', params: { projectId: project.project_id } }">{{ project.name }}</router-link>
    </div>
    <h3>HTML5</h3>
    <div v-for="project in htmlProjectData">
      <router-link v-if="!project.deleted_at" :to="{ name: 'ProjectDetails', params: { projectId: project.project_id } }">{{ project.name }}</router-link>
    </div>
    <h3>Java</h3>
    <div v-for="project in javaProjectData">
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
      javaProjectData: null,
      loggedIn: false,
    };
  },
  async created() {
    // get the project data to display
    let allProjectData = await projectService.getAllProjectData();
    this.pythonProjectData = allProjectData.body.python;
    this.javascriptProjectData = allProjectData.body.javascript;
    this.htmlProjectData = allProjectData.body.html;
    this.javaProjectData = allProjectData.body.java;
    
    // check if logged in
    this.loggedIn = this.$cookies.get('loggedIn');
  },
}
</script>

<style scoped lang="less"></style>