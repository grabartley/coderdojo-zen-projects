<template>
  <div class="project-files-form">
    <h3>Upload Project</h3>
    <input v-validate.initial="'required'" type="file" name="project files" @change="onFileUplaod"></input>
    <label v-if="!isZip">Please upload a zip file</label>
    <div class="error-message" v-show="isFormValidated && errors.has('project files')">{{ errors.first('project files') }}</div>
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
      filename: null,
      uploadedFile: null,
    };
  },
  methods: {
    // check if the form information is valid
    isValid() {
      this.isFormValidated = true;
      return this.isFileUploaded;
    },
    // save the form information in session storage
    submitForm() {
      window.sessionStorage.setItem('filename', this.filename);
      window.sessionStorage.setItem('projectFiles', this.uploadedFile);
    },
    // when a file is chosen for upload
    onFileUplaod(e) {
      let files = e.target.files || e.dataTransfer.files;
      
      // if files exist
      if (files.length) {
        // take the first one
        let file = files[0];
        let fr = new FileReader();
        let vm = this;
        
        // if the file is a zip file
        if (file.type === 'application/zip') {
          this.isZip = true;
          
          // store the filename
          this.filename = file.name;
          
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
</style>