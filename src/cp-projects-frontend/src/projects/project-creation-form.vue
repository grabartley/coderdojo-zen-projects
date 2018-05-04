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
        <div class="project-creation-form__content-section">
          <div class="project-creation-form__content-section-title">
            Project Information
          </div>
          <div class="project-creation-form__content-section-subtitle">
            Tell us what your project is about!
          </div>
          <div class="project-creation-form__content-section-content">
            <div class="project-creation-form__content-section-content-input">
              <div class="project-creation-form__content-section-content-input-name">
                <label>Project Name<span class="project-creation-form__content-section-content-input-name-required">*</span></label>
              </div>
              <div class="project-creation-form__content-section-content-input-field">
                <input v-validate.initial="'required'" v-model="projectName" name="project name" placeholder="e.g. My First Project"></input>
              </div>
            </div>
            <div class="project-creation-form__content-section-content-error">
              <div class="error-message" v-show="isFormValidated && errors.has('project name')">{{ errors.first('project name') }}</div>
            </div>
            <div class="project-creation-form__content-section-content-input">
              <div class="project-creation-form__content-section-content-input-name">
                <label>Project Type<span class="project-creation-form__content-section-content-input-name-required">*</span></label>
              </div>
              <div class="project-creation-form__content-section-content-input-field">
                <label>
                  <input v-validate.initial="'required'" v-model="projectType" name="project type" type="radio" value="python"></input>
                  <div class="project-creation-form__content-section-content-input-field-bubble">
                    <img src="@/assets/python-logo.png" alt="Python Logo" class="project-creation-form__content-section-content-input-field-bubble-image" v-bind:class="{ 'project-creation-form__content-section-content-input-field-bubble-image--selected': isPythonSelected }"></img>
                    <label class="project-creation-form__content-section-content-input-field-bubble-text">Python 3</label>
                  </div>
                </label>
                <label>
                  <input v-model="projectType" name="project type" type="radio" value="javascript"></input>
                  <div class="project-creation-form__content-section-content-input-field-bubble">
                    <img src="@/assets/nodejs-logo.png" alt="NodeJS Logo" class="project-creation-form__content-section-content-input-field-bubble-image" v-bind:class="{ 'project-creation-form__content-section-content-input-field-bubble-image--selected': isNodeJSSelected }"></img>
                    <label class="project-creation-form__content-section-content-input-field-bubble-text">NodeJS</label>
                  </div>
                </label>
                <label>
                  <input v-model="projectType" name="project type" type="radio" value="html"></input>
                  <div class="project-creation-form__content-section-content-input-field-bubble">
                    <img src="@/assets/html5-logo.png" alt="HTML5 Logo" class="project-creation-form__content-section-content-input-field-bubble-image" v-bind:class="{ 'project-creation-form__content-section-content-input-field-bubble-image--selected': isHTMLSelected }"></img>
                    <label class="project-creation-form__content-section-content-input-field-bubble-text">HTML5</label>
                  </div>
                </label>
                <label>
                  <input v-model="projectType" name="project type" type="radio" value="java"></input>
                  <div class="project-creation-form__content-section-content-input-field-bubble">
                    <img src="@/assets/java-logo.png" alt="Java Logo" class="project-creation-form__content-section-content-input-field-bubble-image" v-bind:class="{ 'project-creation-form__content-section-content-input-field-bubble-image--selected': isJavaSelected }"></img>
                    <label class="project-creation-form__content-section-content-input-field-bubble-text">Java</label>
                  </div>
                </label>
              </div>
            </div>
            <div class="project-creation-form__content-section-content-error">
              <div class="error-message" v-show="isFormValidated && errors.has('project type')">{{ errors.first('project type') }}</div>
            </div>
            <div class="project-creation-form__content-section-content-input">
              <div class="project-creation-form__content-section-content-input-name">
                <label>Project Description<span class="project-creation-form__content-section-content-input-name-required">*</span></label>
              </div>
              <div class="project-creation-form__content-section-content-input-field">
                <textarea v-validate.initial="'required'" v-model="projectDescription" name="project description" placeholder="e.g. This is the first project I created on Zen."></textarea>
              </div>
            </div>
            <div class="project-creation-form__content-section-content-error">
              <div class="error-message" v-show="isFormValidated && errors.has('project description')">{{ errors.first('project description') }}</div>
            </div>
            <div class="project-creation-form__content-section-content-input">
              <div class="project-creation-form__content-section-content-input-name">
                <label>Dojo<span class="project-creation-form__content-section-content-input-name-required">*</span></label>
              </div>
              <div v-if="usersDojos && usersDojos.length > 0" class="project-creation-form__content-section-content-input-field">
                <label v-for="dojo in usersDojos">
                  <input v-validate.initial="'required'" v-model="dojoId" name="Dojo" type="radio" :value="dojo.id"></input>
                  <div class="project-creation-form__content-section-content-input-field-bubble">
                    <img src="@/assets/cd-logo.png" alt="Dojo Logo" class="project-creation-form__content-section-content-input-field-bubble-image" v-bind:class="{ 'project-creation-form__content-section-content-input-field-bubble-image--selected': dojo.id === dojoId }"></img>
                    <label class="project-creation-form__content-section-content-input-field-bubble-text">{{ dojo.name }}</label>
                  </div>
                </label>
              </div>
              <div v-else v-validate.initial="'required'" class="project-creation-form__content-section-content-input-message error-message">You need to join a Dojo which has GitHub integrated in order to create a project!</div>
            </div>
            <div class="project-creation-form__content-section-content-error">
              <div class="error-message" v-show="isFormValidated && errors.has('Dojo')">{{ errors.first('Dojo') }}</div>
            </div>
            <div class="project-creation-form__content-section-content-input">
              <div class="project-creation-form__content-section-content-input-name">
                <label>Project Resource</label>
              </div>
              <div class="project-creation-form__content-section-content-input-field">
                <input v-validate.initial="'url'" v-model="projectResource" name="project resource" placeholder="e.g. kata.coderdojo.com"></input>
              </div>
            </div>
            <div class="project-creation-form__content-section-content-error">
              <div class="error-message" v-show="isFormValidated && errors.has('project resource')">{{ errors.first('project resource') }}</div>
            </div>
          </div>
        </div>
        <div class="project-creation-form__content-section">
          <div class="project-creation-form__content-section-title">
            Project Files
          </div>
          <div class="project-creation-form__content-section-subtitle">
            Upload the code for your project here!
          </div>
          <div class="project-creation-form__content-section-content">
            <div class="project-creation-form__content-section-content-input">
              <div class="project-creation-form__content-section-content-input-name">
                <label>Project main filename<span class="project-creation-form__content-section-content-input-name-required">*</span></label>
              </div>
              <div class="project-creation-form__content-section-content-input-field">
                <input v-if="projectType !== 'html'" class="project-creation-form__content-section-content-input-field-filename" v-validate.initial="{ required: true, regex: /^([a-zA-Z0-9\-\_])+$/ }" v-model="projectEntrypoint" name="project entrypoint" :placeholder="entrypointPlaceholder"></input>
                <input v-else class="project-creation-form__content-section-content-input-field-filename" v-validate.initial="'required'" v-model="projectEntrypoint" name="project entrypoint" disabled="disabled"></input>
                <span v-if="projectType" class="project-creation-form__content-section-content-input-field-extension">{{ entrypointExtension }}</span>
              </div>
            </div>
            <div class="project-creation-form__content-section-content-error">
              <div class="error-message" v-show="isFormValidated && errors.has('project entrypoint')">{{ errors.first('project entrypoint') }}</div>
            </div>
            <div class="project-creation-form__content-section-content-input">
              <div class="project-creation-form__content-section-content-input-name">
                <label v-if="!isZip">Please create a zip file containing the source code of your project and upload it here!<span class="project-creation-form__content-section-content-input-name-required">*</span></label>
              </div>
              <div class="project-creation-form__content-section-content-input-field">
                <label class="project-creation-form__content-section-content-input-file">
                  <span class="project-creation-form__content-section-content-input-file-image fa fa-upload" alt="File Upload"></span>
                  <input class="project-creation-form__content-section-content-input-file-hidden" v-validate.initial="'required'" type="file" name="project files" @change="onFileUpload"></input>
                </label>
                <span class="project-creation-form__content-section-content-input-file-details" v-show="filename">
                  <span class="project-creation-form__content-section-content-input-file-details-icon fa fa-file-archive"></span>
                  <span class="project-creation-form__content-section-content-input-file-details-name">{{ filename }}</span>
                </span>
              </div>
            </div>
            <div class="project-creation-form__content-section-content-error">
              <div class="error-message" v-show="isFormValidated && errors.has('project files')">{{ errors.first('project files') }}</div>
              <div class="error-message" v-show="isFormValidated && !isZip">Project files must be uploaded as a zip archive!</div>
            </div>
            <div class="project-creation-form__content-section-content-help">
              <div class="project-creation-form__content-section-content-help-information">
                <span class="project-creation-form__content-section-content-help-information-icon fas fa-info-circle"></span>
                <span class="project-creation-form__content-section-content-help-information-message">The project main file is the file that is run first when running your project.</span>
              </div>
              <div class="project-creation-form__content-section-content-help-information">
                <span class="project-creation-form__content-section-content-help-information-icon fas fa-info-circle"></span>
                <span class="project-creation-form__content-section-content-help-information-message">The project main file must be at the top level of the zip file that you upload or your project will not run correctly!</span>
              </div>
            </div>
          </div>
        </div>
      </form>
      <button class="project-creation-form__content-button primary-button" v-bind:class="{'project-creation-form__content-button--spinning': creatingProject}" @click="createProject()">
        <span v-if="creatingProject" class="fa fa-spinner fa-spin"></span>
        <span v-else>Create Project</span>
      </button>
    </div>
  </div>
</template>
<script>
import projectService from '@/projects/service';
import dojoService from '@/dojos/service';
import userService from '@/users/service';

export default {
  name: 'ProjectCreationForm',
  data() {
    return {
      creatingProject: false,
      loggedInUserId: null,
      usersDojos: null,
      projectName: null,
      projectType: null,
      projectDescription: null,
      dojoId: null,
      projectResource: null,
      isFormValidated: false,
      isPythonSelected: false,
      isNodeJSSelected: false,
      isHTMLSelected: false,
      isJavaSelected: false,
      isZip: false,
      isFileUploaded: false,
      projectEntrypoint: null,
      entrypointExtension: null,
      filename: null,
      uploadedFile: null,
    };
  },
  computed: {
    // returns the placeholder for the entrypoint field based on project type
    entrypointPlaceholder() {
      switch (this.projectType) {
        case 'python':
          return 'e.g. main';
        case 'javascript':
          return 'e.g. index';
        case 'java':
          return 'e.g. Main';
        default:
          return 'Main filename (without extension)';
      }
    },
  },
  methods: {
    // check if the form information is valid
    isValid() {
      this.isFormValidated = true;
      return this.isFileUploaded && !this.creatingProject && !this.errors.any();
    },
    // when a file is chosen for upload
    onFileUpload(e) {
      let files = e.target.files;
      // if files exist
      if (files.length) {
        // take the first one
        let file = files[0];
        let fr = new FileReader();
        let vm = this;
        // store the filename
        this.filename = file.name;
        // if the file is a zip file
        if (file.type === 'application/zip') {
          this.isZip = true;
          // read the file
          fr.readAsDataURL(file);
          // when the file has been read
          fr.onload = (e) => {
            // store the file data
            vm.uploadedFile = e.target.result;
            this.isFileUploaded = true;
          }
        } else {
          this.isZip = false;
          this.isFileUploaded = false;
        }
      }
    },
    // if all form data is valid and we're not already creating a project, create the project
    async createProject() {
      if (this.isValid()) {
        // a project is being created
        this.creatingProject = true;
        
        // create data structure for the information
        const projectData = {
          name: this.projectName,
          type: this.projectType,
          description: this.projectDescription,
          dojoId: this.dojoId,
          resourceUrl: this.projectResource,
          entrypoint: `${this.projectEntrypoint}${this.entrypointExtension}`,
          filename: this.filename,
          file: this.uploadedFile,
          userId: this.$cookie.get('loggedIn'),
        };
        
        // send the project to the backend to save
        const projectId = (await projectService.createProject(projectData)).body;
        
        // send the user to the project page for the project they just created
        this.$router.push(`/project/${projectId}`);
      }
    }
  },
  async created() {
    // get logged in user id
    this.loggedInUserId = this.$cookie.get('loggedIn');
    // if logged in
    if (this.loggedInUserId) {
      // get the user type
      const userType = (await userService.getUserById(this.loggedInUserId)).body.type;
      // if logged in user is not a youth
      if (userType !== 'youth-o13') {
        // shouldn't be here, so send them away
        this.$router.push('/');
      } else {
        // get the logged in users joined dojos
        this.usersDojos = (await dojoService.getUsersDojosWithGitHub(this.loggedInUserId)).body;
      }
    } else {
      // shouldn't be here, so send them away
      this.$router.push('/');
    }
  },
  watch: {
    projectType: {
      // when the project type changes, update associated values
      handler(newProjectType, prevProjectType) {
        this.isPythonSelected = false;
        this.isNodeJSSelected = false;
        this.isHTMLSelected = false;
        this.isJavaSelected = false;
        switch (newProjectType) {
          case 'python':
            this.isPythonSelected = true;
            this.projectEntrypoint = null;
            this.entrypointExtension = '.py';
            break;
          case 'javascript':
            this.isNodeJSSelected = true;
            this.projectEntrypoint = null;
            this.entrypointExtension = '.js';
            break;
          case 'html':
            this.isHTMLSelected = true;
            this.projectEntrypoint = 'index';
            this.entrypointExtension = '.html';
            break;
          case 'java':
            this.isJavaSelected = true;
            this.projectEntrypoint = null;
            this.entrypointExtension = '.java';
        }
      },
    },
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
      margin: 0 32px;
      &-section {
        margin-bottom: 40px;
        text-align: left;
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
            align-items: center;
            margin: 30px 0;
            &-name {
              flex: 2;
              text-align: right;
              margin-top: 5px;
              margin-right: 20px;
              &-required {
                margin-left: 4px;
                color: #9B1C20;
                font-style: italic;
              }
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
                  &--selected {
                    background-color: #73449B;
                    border: solid 7px #73449B;
                    border-radius: 70px;
                  }
                }
                &-text {
                  padding-top: 5px;
                }
              }
              &-extension {
                margin-left: -6px;
                padding: 10px;
                padding-top: 11px;
                font-weight: bold;
                background-color: #73449B;
                color: #FFFFFF;
                border-radius: 2px;
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
            &-message {
              flex: 4;
            }
            &-file {
              &-image {
                padding: 15px 45px;
                border-radius: 10px;
                font-size: 5em;
                color: #000000;
                background-color: #eee;
                border: solid 1px #99999F;
                &:hover {
                  cursor: pointer;
                  color: #FFFFFF;
                  background-color: #99999F;
                  transition: color 0.3s;
                  transition: background-color 0.3s ease-out;
                }
              }
              & input {
                width: 10px;
                position: absolute;
                z-index: -1;
                visibility: hidden;
              }
              &-details {
                display: inline-flex;
                align-items: center;
                margin-left: 40px;
                &-icon {
                  font-size: 40px;
                }
                &-name {
                  margin-left: 10px;
                }
              }
            }
          }
          &-error {
            text-align: center;
          }
          &-help {
            margin-top: 48px;
            &-information {
              display: flex;
              align-items: center;
              margin-top: 8px;
              &-icon {
                font-size: 24px;
                color: #73449B;
              }
              &-message {
                margin-left: 8px;
              }  
            }
          }
        }
      }
      &-button {
        margin: 20px 0;
        &--spinning {
          font-size: 16px;
          width: 50px;
          transition: 0.3s;
        }
      }
    }
  }
</style>