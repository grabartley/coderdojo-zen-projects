<template>
  <div class="project-details-form">
    <div class="project-details-form__section">
      <div class="project-details-form__section-title">
        Project Information
      </div>
      <div class="project-details-form__section-subtitle">
        Tell us what your project is about!
      </div>
      <div class="project-details-form__section-content">
        <div class="project-details-form__section-content-input">
          <div class="project-details-form__section-content-input-name">
            <label>Project Name</label>
          </div>
          <div class="project-details-form__section-content-input-field">
            <input v-validate.initial="'required'" v-model="projectName" name="project name"></input>
          </div>
        </div>
        <div class="project-details-form__section-content-error">
          <div class="error-message" v-show="isFormValidated && errors.has('project name')">{{ errors.first('project name') }}</div>
        </div>
        <div class="project-details-form__section-content-input">
          <div class="project-details-form__section-content-input-name">
            <label>Project Type</label>
          </div>
          <div class="project-details-form__section-content-input-field">
            <label>
              <input v-validate.initial="'required'" v-model="projectType" name="project type" type="radio" value="python"></input>
              <div class="project-details-form__section-content-input-field-bubble">
                <img src="@/assets/python-logo.png" alt="Python Logo" class="project-details-form__section-content-input-field-bubble-image" v-bind:class="{ 'project-details-form__section-content-input-field-bubble-image-selected': isPythonSelected }"></img>
                <label class="project-details-form__section-content-input-field-bubble-text">Python 3</label>
              </div>
            </label>
            <label>
              <input v-model="projectType" name="project type" type="radio" value="javascript"></input>
              <div class="project-details-form__section-content-input-field-bubble">
                <img src="@/assets/nodejs-logo.png" alt="NodeJS Logo" class="project-details-form__section-content-input-field-bubble-image" v-bind:class="{ 'project-details-form__section-content-input-field-bubble-image-selected': isNodeJSSelected }"></img>
                <label class="project-details-form__section-content-input-field-bubble-text">NodeJS</label>
              </div>
            </label>
            <label>
              <input v-model="projectType" name="project type" type="radio" value="html"></input>
              <div class="project-details-form__section-content-input-field-bubble">
                <img src="@/assets/html5-logo.png" alt="HTML5 Logo" class="project-details-form__section-content-input-field-bubble-image" v-bind:class="{ 'project-details-form__section-content-input-field-bubble-image-selected': isHTMLSelected }"></img>
                <label class="project-details-form__section-content-input-field-bubble-text">HTML5</label>
              </div>
            </label>
            <label>
              <input v-model="projectType" name="project type" type="radio" value="java"></input>
              <div class="project-details-form__section-content-input-field-bubble">
                <img src="@/assets/java-logo.png" alt="Java Logo" class="project-details-form__section-content-input-field-bubble-image" v-bind:class="{ 'project-details-form__section-content-input-field-bubble-image-selected': isJavaSelected }"></img>
                <label class="project-details-form__section-content-input-field-bubble-text">Java</label>
              </div>
            </label>
          </div>
        </div>
        <div class="project-details-form__section-content-error">
          <div class="error-message" v-show="isFormValidated && errors.has('project type')">{{ errors.first('project type') }}</div>
        </div>
        <div class="project-details-form__section-content-input">
          <div class="project-details-form__section-content-input-name">
            <label>Project Description</label>
          </div>
          <div class="project-details-form__section-content-input-field">
            <textarea v-validate.initial="'required'" v-model="projectDescription" name="project description"></textarea>
          </div>
        </div>
        <div class="project-details-form__section-content-error">
          <div class="error-message" v-show="isFormValidated && errors.has('project description')">{{ errors.first('project description') }}</div>
        </div>
        <div class="project-details-form__section-content-input">
          <div class="project-details-form__section-content-input-name">
            <label>Dojo</label>
          </div>
          <div class="project-details-form__section-content-input-field">
            <label v-for="dojo in usersDojos">
              <input v-validate.initial="'required'" v-model="dojoId" name="Dojo" type="radio" :value="dojo.id"></input>
              <div class="project-details-form__section-content-input-field-bubble">
                <img src="@/assets/cd-logo.png" alt="Dojo Logo" class="project-details-form__section-content-input-field-bubble-image" v-bind:class="{ 'project-details-form__section-content-input-field-bubble-image-selected': dojo.id === dojoId }"></img>
                <label class="project-details-form__section-content-input-field-bubble-text">{{ dojo.name }}</label>
              </div>
            </label>
          </div>
        </div>
        <div class="project-details-form__section-content-error">
          <div class="error-message" v-show="isFormValidated && errors.has('Dojo')">{{ errors.first('Dojo') }}</div>
        </div>
      </div>
    </div>
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
      projectDescription: null,
      dojoId: null,
      isFormValidated: false,
      isPythonSelected: false,
      isNodeJSSelected: false,
      isHTMLSelected: false,
      isJavaSelected: false,
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
      window.sessionStorage.setItem('projectDescription', this.projectDescription);
      window.sessionStorage.setItem('dojoId', this.dojoId);
    },
  },
  async created() {
    // get the logged in user's joined dojos
    this.loggedInUser = this.$cookies.get('loggedIn');
    if (this.loggedInUser) {
      this.usersDojos = (await dojoService.getUsersDojos(this.loggedInUser)).body;
    } else {
      this.$router.push('/');
    }
  },
  watch: {
    projectType: {
      handler(newProjectType, prevProjectType) {
        this.isPythonSelected = false;
        this.isNodeJSSelected = false;
        this.isHTMLSelected = false;
        this.isJavaSelected = false;
        switch (newProjectType) {
          case 'python':
            this.isPythonSelected = true;
            break;
          case 'javascript':
            this.isNodeJSSelected = true;
            break;
          case 'html':
            this.isHTMLSelected = true;
            break;
          case 'java':
            this.isJavaSelected = true;
        }
      },
    },
  },
}
</script>
<style scoped lang="less">
  .project-details-form {
    margin: 0 32px;
    text-align: left;
    &__section {
      margin-bottom: 40px;
      &-title {
        font-size: 24px;
        color: #0093D5;
        border-bottom: 1px solid #99999F;
      }
      &-subtitle {
        margin-top: 8px;
        font-size: 14px;
        color: #99999F;
      }
      &-content {
        margin-top: 20px;
        &-input {
          display: flex;
          margin: 30px 0;
          justify-content: center;
          align-items: center;
          &-name {
            flex: 2;
            text-align: right;
            margin-right: 20px;
          }
          &-field {
            flex: 4;
            text-align: left;
            margin-right: 10px;
            &-bubble {
              display: inline-flex;
              flex-direction: column;
              align-items: center;
              &-image {
                width: 75px;
                height: 75px;
                border: solid 7px white;
                border-radius: 70px;
                &:hover {
                  background-color: #73449B;
                  border: solid 7px #73449B;
                  border-radius: 70px;
                  cursor: pointer;
                  transition: border 0.3s ease-out;
                }
                &-selected {
                  background-color: #73449B;
                  border: solid 7px #73449B;
                  border-radius: 70px;
                }
              }
              &-text {
                padding-top: 5px;
              }
            }
            & input, textarea {
              width: 60%;
              max-width: 600px;
            }
            & textarea {
              height: 150px;
            }
            & label {
              margin: 0 10px;
              & input {
                width: 10px;
                position: absolute;
                z-index: -1;
                visibility: hidden;
              }
            }
          }
        }
        &-error {
          text-align: center;
        }
      }
    }
  }
</style>