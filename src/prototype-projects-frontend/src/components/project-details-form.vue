<template>
  <div class="project-details-form">
    <h3>Enter Project Information</h3>
    <label>Select project type</label>
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
  </div>
</template>
<script>
export default {
  name: 'ProjectDetailsForm',
  data() {
    return {
      projectType: null,
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
      window.sessionStorage.setItem('projectType', this.projectType);
    },
  },
}
</script>
<style scoped lang="less">
  
</style>