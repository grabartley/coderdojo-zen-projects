<template>
  <div v-if="projectData" class="edit-project">
    <div class="edit-project__banner">
      <img class="edit-project__banner-image" src="@/assets/cd-logo.png" alt="Project Image"></img>
      <span class="edit-project__banner-title">{{ projectData.name }}</span>
      <span class="edit-project__banner-author">by {{ projectData.author }}</span>
    </div>
    <div v-if="!projectData.deleted_at" class="edit-project__actions">
      <button class="edit-project__actions-button" @click="viewProject">
        <span class="fas fa-eye"></span>
      </button>
    </div>
    <div v-if="!projectData.deleted_at" class="edit-project__information">
      <div class="edit-project__information-title">
        Project Information
      </div>
      <div class="edit-project__information-input">
        <div class="edit-project__information-input-name">
          <label>Name</label>
        </div>
        <div class="edit-project__information-input-field">
          <input v-validate.initial="'required'" v-model="name" name="name"></input>
        </div>
      </div>
      <div class="edit-project__information-error">
        <div class="error-message" v-show="isFormValidated && errors.has('name')">{{ errors.first('name') }}</div>
      </div>
      <div class="edit-project__information-input">
        <div class="edit-project__information-input-name">
          <label>Description</label>
        </div>
        <div class="edit-project__information-input-field">
          <textarea v-validate.initial="'required'" v-model="description" name="description"></textarea>
        </div>
      </div>
      <div class="edit-project__information-error">
        <div class="error-message" v-show="isFormValidated && errors.has('description')">{{ errors.first('description') }}</div>
      </div>
      <div class="edit-project__information-input">
        <div class="edit-project__information-input-name">
          <label>Resource</label>
        </div>
        <div class="edit-project__information-input-field">
          <input v-validate.initial="'url'" v-model="resource" name="resource"></input>
        </div>
      </div>
      <div class="edit-project__information-error">
        <div class="error-message" v-show="isFormValidated && errors.has('resource')">{{ errors.first('resource') }}</div>
      </div>
      <div class="edit-project__information-title">
        Project Files
      </div>
      <div class="edit-project__information-input">
        <div class="edit-project__information-input-name">
          <label>Main file</label>
        </div>
        <div class="edit-project__information-input-field">
          <input v-validate.initial="{ required: true, regex: /^([a-zA-Z0-9\-\_])+\.([a-zA-Z])+$/ }" v-model="entrypoint" name="entrypoint"></input>
        </div>
      </div>
      <div class="edit-project__information-error">
        <div class="error-message" v-show="isFormValidated && errors.has('entrypoint')">{{ errors.first('entrypoint') }}</div>
      </div>
      <div class="edit-project__information-input">
        <div class="edit-project__information-input-name">
          <label v-if="!isZip">Please upload your project as a zip file with the project main file at the top level of the zip archive</label>
        </div>
        <div class="edit-project__information-input-field">
          <label class="edit-project__information-input-file">
            <span class="edit-project__information-input-file-image fa fa-upload" alt="File Upload"></span>
            <input class="edit-project__information-input-file-hidden" type="file" name="project files" @change="onFileUpload"></input>
          </label>
          <span class="edit-project__information-input-file-details" v-show="filename">
            <span class="edit-project__information-input-file-details-icon fa fa-file-archive"></span>
            <span class="edit-project__information-input-file-details-name">{{ filename }}</span>
          </span>
        </div>
      </div>
    </div>
    <div v-if="!projectData.deleted_at" class="edit-project__control">
      <button class="primary-button" v-bind:class="{'edit-project__control-spinning': updatingProject}" @click="updateProject()">
        <span v-if="updatingProject" class="fa fa-spinner fa-spin"></span>
        <span v-else>Update Project</span>
      </button>
      <button class="danger-button" v-bind:class="{'edit-project__control-spinning': deletingProject}" @click="deleteProject()">
        <span v-if="deletingProject" class="fa fa-spinner fa-spin"></span>
        <span v-else>Delete Project</span>
      </button>
    </div>
    <div v-else class="edit-project__deleted">
      <div class="edit-project__deleted-box">
        <div class="edit-project__deleted-box-message">
          <span class="edit-project__deleted-box-message-icon fas fa-ban"></span>
          <span class="edit-project__deleted-box-message-text">This project was deleted!</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import projectService from '@/projects/service';

  export default {
    name: 'EditProject',
    data() {
      return {
        projectData: null,
        name: null,
        description: null,
        resource: null,
        entrypoint: null,
        isZip: false,
        filename: null,
        uploadedFile: null,
        isFileUploaded: false,
        isFormValidated: false,
        updatingProject: false,
        deletingProject: false,
      };
    },
    methods: {
      // go to the project details page for this project
      viewProject() {
        this.$router.push(`/project/${this.projectData.project_id}`);
      },
      // check if the form information is valid
      isValid() {
        this.isFormValidated = true;
        return this.filename ? this.isFileUploaded && !this.updatingProject && !this.errors.any() : !this.updatingProject && !this.errors.any();
      },
      async updateProject() {
        // if form information is valid
        if (this.isValid()) {
          // the project is being updated
          this.updatingProject = true;
          // make API call to update project
          await projectService.updateProject({
            projectId: this.projectData.project_id,
            type: this.projectData.type,
            columns: ['name', 'description', 'resource_url', 'entrypoint'],
            values: [this.name, this.description, this.resource, this.entrypoint],
            githubIntegrationId: this.projectData.github_integration_id,
            filename: this.filename,
            file: this.uploadedFile,
          });
          // redirect to the project details page when finished updating
          this.$router.push(`/project/${this.projectData.project_id}`);
        }
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
      async deleteProject() {
        // if not already deleting
        if (!this.deletingProject) {
          // project is being deleted
          this.deletingProject = true;
          // make API call to delete project
          await projectService.deleteProjectById(this.projectData.project_id);
          // redirect to project list
          this.$router.push('/');
        }
      },
    },
    async created() {
      // get project id from route params
      const projectId = this.$route.params.projectId;
      // get project data based on id
      this.projectData = (await projectService.getProjectById(projectId)).body;
      this.name = this.projectData.name;
      this.description = this.projectData.description;
      this.resource = this.projectData.resource_url;
      this.entrypoint = this.projectData.entrypoint;
    },
  }
</script>
<style scoped lang="less">
  .edit-project {
    &__banner {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      padding: 15px 20px;
      color: white;
      background-color: #73449B;
      &-image {
        width: 65px;
        height: 65px;
      }
      &-title {
        flex: 2;
        margin-left: 16px;
        text-align: left;
        font-size: 30px;
      }
      &-author {
        flex: 2;
        text-align: right;
        font-size: 18px;
      }
    }
    &__actions {
      margin: 0 32px;
      text-align: right;
      &-button {
        width: 50px;
        height: 30px;
        font-size: 16px;
        color: #73449B;
        background-color: #FFFFFF;
        border: solid 1px #73449B;
        border-radius: 4px;
        &:hover {
          cursor: pointer;
          color: #FFFFFF;
          background-color: #73449B;
        }
      }
    }
    &__information {
      margin: 0 32px;
      text-align: left;
      &-title {
        font-size: 24px;
        color: #0093D5;
        border-bottom: 1px solid #99999F;
      }
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
          margin-right: 10px;
          text-align: left;
          & input, textarea {
            width: 60%;
            max-width: 600px;
          }
          & textarea {
            height: 150px;
          }
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
    }
    &__control {
      margin: 20px 0;
      &-spinning {
        font-size: 16px;
        width: 50px;
        transition: 0.3s;
      }
    }
    &__deleted {
      padding: 20px 30px;
      &-box {
        padding: 20px 30px;
        border: solid 1px #FAA31A;
        border-bottom: solid 2px #FAA31A;
        &-message {
          &-icon {
            color: #9B1C20;
          }
        }
      }
    }
  }
</style>