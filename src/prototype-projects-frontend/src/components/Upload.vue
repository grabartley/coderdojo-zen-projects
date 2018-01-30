<template>
  <div class="upload">
    <div v-if="!isTypeSelected" class="upload-type">
      <h2>Select Project Type</h2>
      <form ref="type-form">
        <input type="radio" name="type" value="python" ref="pythonType">
          <label for="python-type">Python</label>
        </input>
        <input type="radio" name="type" value="javascript" ref="javascriptType">
          <label for="javascript-type">JavaScript</label>
        </input>
        <input type="radio" name="type" value="html" ref="htmlType">
          <label for="html-type">HTML/CSS/JavaScript</label>
        </input>
        <input type="button" value="Choose" @click="onTypeSelected"></input>
      </form>
    </div>
    <div v-else class="upload-file">
      <h2>Upload Project</h2>
      <input v-if="!isFileUploaded" type="file" name="project" @change="onFileUplaod"></input>
      <label v-else >File has been upoaded!</label>
      <label v-if="!isZip">Please upload a zip file</label>
    </div>
    <div class="upload-project-list">
      <h2>Python Projects</h2>
      <div v-for="project in pythonProjectData">
        {{ project }} : 
        <router-link :to="{ name: 'Runtime', params: {} }">Run the project</router-link>
      </div>
      <h2>JavaScript Projects</h2>
      <div v-for="project in javascriptProjectData">
        {{ project }} : 
        <router-link :to="{ name: 'Runtime', params: {} }">Run the project</router-link>
      </div>
      <h2>HTML/CSS/JavaScript Projects</h2>
      <div v-for="project in htmlProjectData">
        {{ project }} : 
        <router-link :to="{ name: 'Runtime', params: {} }">Run the project</router-link>
      </div>
    </div>
    <div class="upload-footer">
      <router-link :to="{ name: 'Acknowledgements', params: {} }">Acknowledgements</router-link>
    </div>
  </div>
</template>

<script>
import projectService from '@/projects/service';

export default {
  name: 'Upload',
  data() {
    return {
      isTypeSelected: false,
      projectType: null,
      filename: null,
      isZip: false,
      uploadedFile: null,
      isFileUploaded: false,
      pythonProjectData: null,
      javascriptProjectData: null,
      htmlProjectData: null,
    };
  },
  methods: {
    // when a type has been selected
    onTypeSelected() {
      this.isTypeSelected = this.$refs.pythonType.checked || this.$refs.javascriptType.checked || this.$refs.htmlType.checked;
      if (this.isTypeSelected) {
        // if Python has been selected
        if (this.$refs.pythonType.checked) {
          this.projectType = 'python';
          // if JavaScript has been selected
        } else if (this.$refs.javascriptType.checked) {
          this.projectType = 'javascript';
          // if HTML has been selected
        } else {
          this.projectType = 'html';
        }
      }
    },
    // when a file is chosen for upload
    onFileUplaod(e) {
      let files = e.target.files || e.dataTransfer.files;
      
      // if files exist
      if (files.length) {
        // save the first one...
        this.createProject(files[0]);
      }
    },
    // creates a new project with the uploaded file
    createProject(file) {
      let fr = new FileReader();
      let vm = this;
      
      // store the filename
      this.filename = file.name;
      
      // if the file is a zip file
      if (file.type === 'application/zip') {
        this.isZip = true;
        
        // when the file has been read
        fr.onload = (e) => {
          // store the file data
          vm.uploadedFile = e.target.result;
          
          // data structure
          let fileData = {
            filename: vm.filename,
            type: vm.projectType,
            file: vm.uploadedFile,
          };
          
          // send the file to the backend to save
          projectService.createProject(fileData);
          this.isFileUploaded = true;
        }
        
        // read the file
        fr.readAsDataURL(file);
      } else {
        this.isZip = false;
      }
    },
  },
  async created() {
    // get the project data to display
    let allProjectData = await projectService.getAllProjectData();
    this.pythonProjectData = allProjectData.body.python;
    this.javascriptProjectData = allProjectData.body.javascript;
    this.htmlProjectData = allProjectData.body.html;
  },
}
</script>

<style scoped lang="less">
  .upload {
    margin-top: 50px;
    text-align: center;
    
    &-footer {
      margin-top: 50px;
    }
  }
</style>