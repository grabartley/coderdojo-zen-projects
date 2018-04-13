<template>
  <div v-if="userData" class="view-profile">
    <div class="view-profile__banner">
      <span class="view-profile__banner-title">{{ userData.name }}</span>
    </div>
    <div class="view-profile__information">
      <div class="view-profile__information-sidebar">
        <div class="view-profile__information-sidebar-item">
          <div class="view-profile__information-sidebar-item-header">
            <span class="fas fa-envelope"></span>
            <span>email</span>
          </div>
          <div class="view-profile__information-sidebar-item-data">
            <span>{{ userData.email }}</span>
          </div>
        </div>
      </div>
      <div class="view-profile__information-content">
        <div v-if="userData.type === 'youth-o13' && usersProjects" class="view-profile__information-content-section">
          <div class="view-profile__information-content-section-title">
            Projects
          </div>
          <div class="view-profile__information-content-section-content" style="text-align: center;">
            <div v-for="project in usersProjects" class="view-profile__bubble" @click="viewProject(project.project_id)">
              <img :src="projectTypeImage(project.type)" alt="Project Technology" class="view-profile__bubble-image"></img>
              <span class="view-profile__bubble-text">{{ project.name }}</span>
            </div>
          </div>
        </div>
        <div class="view-profile__information-content-section">
          <div class="view-profile__information-content-section-title">
            Dojos
          </div>
          <div class="view-profile__information-content-section-content" style="text-align: center;">
            <div v-for="dojo in usersDojos" class="view-profile__bubble" @click="viewDojo(dojo.id)">
              <img src="@/assets/cd-logo.png" alt="Dojo Logo" class="view-profile__bubble-image"></img>
              <span class="view-profile__bubble-text">{{ dojo.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import userService from '@/users/service';
  import dojoService from '@/dojos/service';
  import projectService from '@/projects/service';

  export default {
    name: 'ViewProfile',
    data() {
      return {
        userData: null,
        usersDojos: null,
        usersProjects: null,
      };
    },
    methods: {
      projectTypeImage(type) {
        switch (type) {
          case ('python'):
            return require('@/assets/python-logo.png');
          case ('javascript'):
            return require('@/assets/nodejs-logo.png');
          case ('html'):
            return require('@/assets/html5-logo.png');
          case ('java'):
            return require('@/assets/java-logo.png');
          default:
            return '';
        }
      },
      viewProject(projectId) {
        this.$router.push(`/project/${projectId}`);
      },
      viewDojo(dojoId) {
        this.$router.push(`/dojos/${dojoId}`);
      },
    },
    async created() {
      const userId = this.$route.params.userId;
      
      // get user, dojo and project data
      this.userData = (await userService.getUserData(userId)).body;
      this.usersDojos = (await dojoService.getUsersDojos(userId)).body;
      this.usersProjects = (await projectService.getProjectsForUser(userId)).body;
    },
  }
</script>
<style scoped lang="less">
  .view-profile {
    &__banner {
      padding: 25px 20px;
      color: white;
      background-color: #73449B;
      &-title {
        margin-left: 16px;
        font-size: 30px;
      }
    }
    &__information {
      display: flex;
      text-align: left;
      &-sidebar {
        flex: 1.75;
        padding: 20px 25px;
        font-size: 16px;
        background-color: #f8f8f8;
        &-item {
          margin-bottom: 30px;
          &-header {
            font-weight: bold;
            text-transform: uppercase;
            color: #73449B;
          }
          &-data {
            margin-top: 4px;
          }
        }
      }
      &-content {
        flex: 6;
        padding: 20px 30px 10px 30px;
        &-actions {
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
        &-section {
          margin-bottom: 40px;
          &-title {
            font-size: 20px;
            color: #0093D5;
            border-bottom: 1px solid #99999F;
          }
          &-content {
            margin-top: 14px;
          }
        }
      }
    }
    &__bubble {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      margin: 10px;
      &-image {
        width: 95px;
        height: 95px;
        border: solid 7px #FFFFFF;
        border-radius: 70px;
        &:hover {
          background-color: #73449B;
          border: solid 7px #73449B;
          border-radius: 70px;
          cursor: pointer;
          transition: border 0.3s ease-out;
        }
      }
      &-text {
        max-width: 100px;
        padding-top: 8px;
      }
    }
  }
</style>