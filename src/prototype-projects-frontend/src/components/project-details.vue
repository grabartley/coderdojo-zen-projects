<template>
  <div v-if="projectData && !projectData.deleted_at" class="project-details">
    <div class="project-details__banner">
      <img class="project-details__banner-image" src="@/assets/cd-logo.png" alt="Project Image"></img>
      <span class="project-details__banner-title">{{ projectData.name }}</span>
      <span class="project-details__banner-author">by {{ projectData.author }}</span>
    </div>
    <div class="project-details__information">
      <div class="project-details__information-sidebar">
        <div class="project-details__information-sidebar-item">
          <div class="project-details__information-sidebar-item-header">
            <span class="project-details__information-sidebar-item-header-icon fas fa-wrench"></span>
            <label class="project-details__information-sidebar-item-header-name">technology</label>
          </div>
          <div class="project-details__information-sidebar-item-data" style="text-align: center;">
            <div class="project-details__bubble">
              <img :src="projectTypeImage" alt="Technology Logo" class="project-details__bubble-image"></img>
              <label class="project-details__bubble-text">{{ projectType }}</label>
            </div>
          </div>
        </div>
        <div class="project-details__information-sidebar-item">
          <div class="project-details__information-sidebar-item-header">
            <span class="project-details__information-sidebar-item-header-icon fas fa-user-circle"></span>
            <label class="project-details__information-sidebar-item-header-name">author</label>
          </div>
          <div class="project-details__information-sidebar-item-data">
            <div class="project-details__information-sidebar-item-data-link">
              <router-link :to="{ name: 'ViewProfile', params: { userId: projectData.user_id } }">{{ projectData.author }}</router-link>
            </div>
          </div>
        </div>
        <div v-if="dojoData" class="project-details__information-sidebar-item">
          <div class="project-details__information-sidebar-item-header">
            <span class="project-details__information-sidebar-item-header-icon fas fa-users"></span>
            <label class="project-details__information-sidebar-item-header-name">dojo</label>
          </div>
          <div class="project-details__information-sidebar-item-data" style="text-align: center;">
            <div class="project-details__bubble">
              <img src="@/assets/cd-logo.png" alt="Python Logo" class="project-details__bubble-image"></img>
              <label class="project-details__bubble-text">{{ dojoData.name }}</label>
            </div>
          </div>
        </div>
        <div class="project-details__information-sidebar-item">
          <div class="project-details__information-sidebar-item-header">
            <span class="project-details__information-sidebar-item-header-icon far fa-clock"></span>
            <label class="project-details__information-sidebar-item-header-name">last updated</label>
          </div>
          <div class="project-details__information-sidebar-item-data">
            <label>Last updated at <strong>{{ lastUpdatedTime }}</strong> on the <strong>{{ lastUpdatedDate }}</strong></label>
          </div>
        </div>
        <div class="project-details__information-sidebar-item">
          <div class="project-details__information-sidebar-item-header">
            <span class="project-details__information-sidebar-item-header-icon fa fa-code"></span>
            <label class="project-details__information-sidebar-item-header-name">source code</label>
          </div>
          <div class="project-details__information-sidebar-item-data">
            <div class="project-details__information-sidebar-item-data-link">
              <a :href="projectData.github" target="_blank">View source code</a>
            </div>
          </div>
        </div>
      </div>
      <div class="project-details__information-content">
        <div class="project-details__information-content-actions">
          <button class="project-details__information-content-actions-button" @click="">
            <span class="fas fa-share-alt"></span>
          </button>
          <button v-if="currentUser" class="project-details__information-content-actions-button" @click="editProject()">
            <span class="fas fa-edit"></span>
          </button>
        </div>
        <div class="project-details__information-content-section">
          <div class="project-details__information-content-section-title">
            Try it out!
          </div>
          <div class="project-details__information-content-section-content">
            <div v-if="projectData.type === 'html'" class="project-details__information-content-section-content-webpage">
              <span class="project-details__information-content-section-content-webpage-link">
                <a :href="githubPagesLink" target="_blank">
                  <span class="project-details__information-content-section-content-webpage-link-text">Visit the website</span>
                  <span class="project-details__information-content-section-content-webpage-link-icon fas fa-angle-right"></span>
                </a>
              </span>
              <iframe class="project-details__information-content-section-content-webpage-window" :src="githubPagesLink"></iframe>
            </div>
            <div v-else>
              <label>Click the button below to try out {{ projectData.name }}!</label>
              <div class="project-details__information-content-section-content-run">
                <router-link class="primary-button" :to="{ name: 'ProjectRuntime', params: { projectId: projectData.project_id } }"><span class="project-details__information-content-section-content-run-icon fas fa-play"></span>Play</router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="project-details__information-content-section">
          <div class="project-details__information-content-section-title">
            Description
          </div>
          <div class="project-details__information-content-section-content">
            {{ projectData.description }}
          </div>
        </div>
        <div class="project-details__information-content-section">
          <div class="project-details__information-content-section-title">
            Badges
          </div>
          <div class="project-details__information-content-section-content">
            Badges have not been integrated yet!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  import projectService from '@/projects/service';
  import dojoService from '@/dojos/service';

  export default {
    name: 'ProjectDetails',
    data() {
      return {
        projectData: null,
        dojoData: null,
        currentUser: null,
      };
    },
    computed: {
      projectTypeImage() {
        switch (this.projectData.type) {
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
      projectType() {
        switch (this.projectData.type) {
          case ('python'):
            return 'Python 3';
          case ('javascript'):
            return 'NodeJS';
          case ('html'):
            return 'HTML5'
          case ('java'):
            return 'Java';
          default:
            return '';
        }
      },
      lastUpdatedTime() {
        return moment(this.projectData.updated_at || this.projectData.created_at).format('h:mma');
      },
      lastUpdatedDate() {
        return moment(this.projectData.updated_at || this.projectData.created_at).format('Do of MMMM YYYY');
      },
      githubPagesLink() {
        let githubAccount = this.projectData.github.split('/');
        githubAccount = githubAccount[githubAccount.length - 2]
        return `https://${githubAccount}.github.io/${this.projectData.project_id}`;
      },
    },
    methods: {
      editProject() {
        this.$router.push(`/edit-project/${this.projectData.project_id}`);
      },
    },
    async created() {
      const projectId = this.$route.params.projectId;
      this.projectData = (await projectService.getProjectById(projectId)).body;
      
      this.dojoData = (await dojoService.getDojoByGitHubId(this.projectData.github_integration_id)).body;
      
      const loggedInUserId = this.$cookies.get('loggedIn');
      if (this.projectData.user_id === loggedInUserId) {
        this.currentUser = loggedInUserId;
      } 
    },
  }
</script>
<style scoped lang="less">
  .project-details {
    &__banner {
      display: flex;
      align-items: center;
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
            &-link {
              display: flex;
              align-items: center;
              & a {
                text-decoration: none;
                color: #0093D5;
                &:hover {
                  text-decoration: underline;
                  color: #005e89;
                }
              }
            }
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
            margin-left: 4px;
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
            &-webpage {
              margin: 10px 0;
              text-align: right;
              &-link {
                color: #0093D5;
                & a {
                  text-decoration: none;
                  color: #0093D5;
                  &:hover {
                    text-decoration: underline;
                    color: #005e89;
                  }
                }
              }
              &-window {
                margin-top: 10px;
                width: 100%;
                height: 600px;
              }
            }
            &-run {
              margin: 75px 0;
              text-align: center;
              &-icon {
                margin-right: 8px;
              }
              & a {
                text-decoration: none;
              }
            }
          }
        }
      }
    }
    &__bubble {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      margin-top: 10px;
      &-image {
        width: 85px;
        height: 85px;
      }
      &-text {
        padding-top: 8px;
      }
    }
  }
</style>