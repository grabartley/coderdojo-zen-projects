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
    <label>Project main file</label>
    <input v-validate.initial="{ required: true, regex: /^([a-zA-Z0-9\-\_])+\.([a-zA-Z])+$/ }" v-model="projectMain" name="project main"></input>
    <div class="error-message" v-show="isFormValidated && errors.has('project main')">{{ errors.first('project main') }}</div>
    <label>Project description</label>
    <input v-validate.initial="'required'" v-model="projectDescription" name="project description"></input>
    <div class="error-message" v-show="isFormValidated && errors.has('project description')">{{ errors.first('project description') }}</div>
  </div>
</template>
<script>
export default {
  name: 'ProjectDetailsForm',
  data() {
    return {
      projectName: null,
      projectType: null,
      projectMain: null,
      projectDescription: null,
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
      window.sessionStorage.setItem('projectMain', this.projectMain);
      window.sessionStorage.setItem('projectDescription', this.projectDescription);
    },
  },
}
</script>
<style scoped lang="less">
  
</style>