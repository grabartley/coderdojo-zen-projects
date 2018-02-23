<template>
  <div class="project-details-form">
    <h3>Enter Project Information</h3>
    <label>Project name</label>
    <input v-validate.initial="'required'" v-model="projectName" name="project name"></input>
    <div class="error-message" v-show="isFormValidated && errors.has('project name')">{{ errors.first('project name') }}</div>
    <label>Project type</label>
    <label>
      <input v-validate.initial="'required'" v-model="projectType" name="project type" type="radio" value="python"></input>
      Python
    </label>
    <label>
      <input v-model="projectType" name="project type" type="radio" value="javascript"></input>
      JavaScript
    </label>
    <label>
      <input v-model="projectType" name="project type" type="radio" value="html"></input>
      HTML/CSS/JavaScript
    </label>
    <div class="error-message" v-show="isFormValidated && errors.has('project type')">{{ errors.first('project type') }}</div>
    <label>Project entrypoint</label>
    <input v-validate.initial="{ required: true, regex: /^([a-zA-Z0-9\-\_])+\.([a-zA-Z])+$/ }" v-model="projectEntrypoint" name="project entrypoint"></input>
    <div class="error-message" v-show="isFormValidated && errors.has('project entrypoint')">{{ errors.first('project entrypoint') }}</div>
    <label>Project description</label>
    <input v-validate.initial="'required'" v-model="projectDescription" name="project description"></input>
    <div class="error-message" v-show="isFormValidated && errors.has('project description')">{{ errors.first('project description') }}</div>
    <label>Dojo</label>
    <select v-validate.initial="'required'" v-model="dojo" name="Dojo">
      <option v-for="dojo in usersDojos" :value="dojo.name">{{ dojo.name }}</option>
    </select>
    <div class="error-message" v-show="isFormValidated && errors.has('Dojo')">{{ errors.first('Dojo') }}</div>
  </div>
</template>
<script>
import dojoService from '@/dojos/service';

export default {
  name: 'ProjectDetailsForm',
  data() {
    return {
      loggedInUser: null,
      usersDojos: null,
      projectName: null,
      projectType: null,
      projectEntrypoint: null,
      projectDescription: null,
      dojo: null,
      isFormValidated: false,
    };
  },
  methods: {
    // check if the form information is valid
    isValid() {
      this.isFormValidated = true;
      return !this.errors.any();
    },
    // save the form information in session storage
    submitForm() {
      window.sessionStorage.setItem('projectName', this.projectName);
      window.sessionStorage.setItem('projectType', this.projectType);
      window.sessionStorage.setItem('projectEntrypoint', this.projectEntrypoint);
      window.sessionStorage.setItem('projectDescription', this.projectDescription);
      window.sessionStorage.setItem('dojoId', this.dojo.id);
    },
  },
  async created() {
    // get the logged in user's joined dojos
    this.loggedInUser = this.$cookies.get('loggedIn');
    if (this.loggedInUser) {
      this.usersDojos = (await dojoService.getUsersDojos(this.loggedInUser)).body;
    }
  },
}
</script>
<style scoped lang="less">
</style>