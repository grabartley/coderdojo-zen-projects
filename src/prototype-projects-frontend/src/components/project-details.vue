<template>
  <div v-if="projectData" class="project-details">
    <div class="project-details__header">
      <div class="project-details__header-title">{{ projectData.name }}</div>
      <div class="project-details__header-author">by {{ projectData.author }}</div>
    </div>
    <div class="project-details__information">
      <div class="project-details__information-sidebar">
        <div class="project-details__information-sidebar-item">Technology: {{ projectData.type }}</div>
        <div class="project-details__information-sidebar-item">Created at: {{ projectData.created_at }}</div>
      </div>
      <div class="project-details__information-content">
        <button v-if="currentUser" @click="deleteProject()">Delete Project</button>
        <div>{{ projectData.description }}</div>
        <router-link :to="{ name: 'ProjectRuntime', params: { id: projectData.project_id } }">Run the project</router-link>
      </div>
    </div>
  </div>
</template>
<script>
  import projectService from '@/projects/service';

  export default {
    name: 'ProjectDetails',
    data() {
      return {
        projectData: null,
        currentUser: null,
      };
    },
    methods: {
      async deleteProject() {
        await projectService.deleteProjectById(this.projectData.project_id);
        this.$router.push('/');
      },
    },
    async created() {
      const projectId = this.$route.params.projectId;
      this.projectData = (await projectService.getProjectById(projectId)).body;
      
      const loggedInUserId = this.$cookies.get('loggedIn');
      if (this.projectData.user_id === loggedInUserId) {
        this.currentUser = loggedInUserId;
      } 
    },
  }
</script>
<style scoped lang="less">
  .project-details {
    &__header {
      padding: 20px 0 15px 0;
      color: white;
      background-color: #73449B; 
      &-title {
        font-size: 1.75em;
      }
      &-author {
        font-size: 1.2em;
        
      }
    }
    &__information {
      display: flex;
      text-align: left;
      
      &-sidebar {
        flex: 2;
        padding: 10px;
        background-color: #bfbfbf;
        &-item {
          margin: 10px 0;
        }
      }
      &-content {
        flex: 6;
        padding: 20px 10px 10px 10px;
        & button {
          float: right;
          padding: 10px;
          border-radius: 10px;
          color: white;
          font-weight: bold;
          background-color: red;
          &:hover {
            cursor: pointer;
            background-color: #ff5c33;
          }
        }
      }
    }
  }
</style>