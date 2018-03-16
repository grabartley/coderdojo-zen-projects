<template>
  <div v-if="projectData" class="edit-project">
    <div class="edit-project__details">
      <div class="edit-project__details-input">
        Name: <input v-model="name"></input>
      </div>
      <div class="edit-project__details-input">
        Description: <textarea v-model="description" rows="5" cols="50"></textarea>
      </div>
      <div class="edit-project__details-input">
        Entrypoint: <input v-model="entrypoint"></input>
      </div>
      <div class="edit-project__details-submit">
        <button class="primary-button" @click="updateDetails()">Update Details</button>
      </div>
    </div>
    <div class="edit-project__files">
      <div class="edit-project__files-input">
        Files: <input @change="onFileUpload" type="file"></input>
      </div>
      <div class="edit-project__files-submit">
        <button class="primary-button" @click="updateFiles()">Update Files</button>
      </div>
    </div>
    <div class="edit-project__advanced">
      <button class="danger-button" @click="deleteProject()">Delete Project</button>
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
        entrypoint: null,
        isZip: false,
        filename: null,
        uploadedFile: null,
        isFileUploaded: false,
      };
    },
    methods: {
      async updateDetails() {
        await projectService.updateProject({
          projectId: this.projectData.project_id,
          type: this.projectData.type,
          columns: ['name', 'description', 'entrypoint'],
          values: [this.name, this.description, this.entrypoint],
        });
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
      async updateFiles() {
        if (this.isFileUploaded) {
          await projectService.updateProject({
            projectId: this.projectData.project_id,
            type: this.projectData.type,
            githubIntegrationId: this.projectData.github_integration_id,
            filename: this.filename,
            file: this.uploadedFile,
          });
        }
      },
      async deleteProject() {
        await projectService.deleteProjectById(this.projectData.project_id);
        this.$router.push('/');
      },
    },
    async created() {
      const projectId = this.$route.params.projectId;
      this.projectData = (await projectService.getProjectById(projectId)).body;
      this.name = this.projectData.name;
      this.description = this.projectData.description;
      this.entrypoint = this.projectData.entrypoint;
    },
  }
</script>
<style scoped lang="less">
  .edit-project {
    &__details {
      &-input {
        margin: 20px 0;
      }
    }
    &__files {
      &-input {
        margin: 20px 0;
      }
    }
    &__advanced {
      margin: 20px 0;
    }
  }
</style>