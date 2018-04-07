<template>
  <div class="project-files-form">
    <div class="project-files-form__section">
      <div class="project-files-form__section-title">
        Project Files
      </div>
      <div class="project-files-form__section-subtitle">
        Upload the code for your project here!
      </div>
      <div class="project-files-form__section-content">
        <div class="project-files-form__section-content-input">
          <div class="project-files-form__section-content-input-name">
            <label>Project main file</label>
          </div>
          <div class="project-files-form__section-content-input-field">
            <input v-validate.initial="{ required: true, regex: /^([a-zA-Z0-9\-\_])+\.([a-zA-Z])+$/ }" v-model="projectEntrypoint" name="project entrypoint"></input>
          </div>
        </div>
        <div class="project-files-form__section-content-error">
          <div class="error-message" v-show="isFormValidated && errors.has('project entrypoint')">{{ errors.first('project entrypoint') }}</div>
        </div>
        <div class="project-files-form__section-content-input">
          <div class="project-files-form__section-content-input-name">
            <label v-if="!isZip">Please upload your project as a zip file with the project main file at the top level of the zip archive</label>
          </div>
          <div class="project-files-form__section-content-input-field">
            <label class="project-files-form__section-content-input-file">
              <span class="project-files-form__section-content-input-file-image fa fa-upload" alt="File Upload"></span>
              <input class="project-files-form__section-content-input-file-hidden" v-validate.initial="'required'" type="file" name="project files" @change="onFileUpload"></input>
            </label>
            <span class="project-files-form__section-content-input-file-details" v-show="filename">
              <span class="project-files-form__section-content-input-file-details-icon fa fa-file-archive"></span>
              <span class="project-files-form__section-content-input-file-details-name">{{ filename }}</span>
            </span>
          </div>
        </div>
        <div class="project-files-form__section-content-error">
          <div class="error-message" v-show="isFormValidated && errors.has('project files')">{{ errors.first('project files') }}</div>
          <div class="error-message" v-show="isFormValidated && !isZip">Project files must be uploaded as a zip archive!</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ProjectFilesForm',
  data() {
    return {
      isZip: false,
      isFileUploaded: false,
      isFormValidated: false,
      projectEntrypoint: null,
      filename: null,
      uploadedFile: null,
    };
  },
  methods: {
    // check if the form information is valid
    isValid() {
      this.isFormValidated = true;
      return this.isFileUploaded && !this.errors.any();
    },
    // save the form information in session storage
    submitForm() {
      window.sessionStorage.setItem('projectEntrypoint', this.projectEntrypoint);
      window.sessionStorage.setItem('filename', this.filename);
      window.sessionStorage.setItem('projectFiles', this.uploadedFile);
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
        }
      }
    },
  },
}
</script>
<style scoped lang="less">
  .project-files-form {
    margin: 0 32px;
    text-align: left;
    &__section {
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
            margin-right: 10px;
            text-align: left;
            & input {
              width: 60%;
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
    }
  }
</style>