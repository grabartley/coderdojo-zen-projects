<template>
  <div class="project-list">
    <div class="project-list-header">
      <button @click="logout" v-if="loggedIn">Logout</button>
      <router-link v-else :to="{ name: 'Login', params: {} }">Login</router-link>
    </div>
    <h2>All Projects</h2>
    <h3>Python</h3>
    <div v-for="project in pythonProjectData">
      {{ project.name }} : 
      <router-link :to="{ name: 'ProjectRuntime', params: { id: project.id } }">Run the project</router-link>
    </div>
    <h3>JavaScript</h3>
    <div v-for="project in javascriptProjectData">
      {{ project.name }} : 
      <router-link :to="{ name: 'ProjectRuntime', params: { id: project.id } }">Run the project</router-link>
    </div>
    <h3>HTML/CSS/JavaScript</h3>
    <div v-for="project in htmlProjectData">
      {{ project.name }} : 
      <router-link :to="{ name: 'ProjectRuntime', params: { id: project.id } }">Run the project</router-link>
    </div>
    <div class="project-list-footer">
      <router-link :to="{ name: 'ProjectCreationForm', params: {} }">Create a Project</router-link>
      <router-link :to="{ name: 'Acknowledgements', params: {} }">Acknowledgements</router-link>
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
  methods: {
    logout() {
      this.$cookies.remove('loggedIn');
      this.loggedIn = false;
    },
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
    &-header {
      margin-right: 50px;
      text-align: right;
    }
    
    &-footer {
      margin-top: 50px;
    }
  }
</style>