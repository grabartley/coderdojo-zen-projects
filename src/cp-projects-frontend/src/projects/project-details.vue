<template>
  <div v-if="projectData" class="project-details">
    <div class="project-details__banner">
      <img class="project-details__banner-image" src="@/assets/cd-logo.png" alt="Project Image"></img>
      <span class="project-details__banner-title">{{ projectData.name }}</span>
      <span class="project-details__banner-author">by {{ projectData.author }}</span>
    </div>
    <div v-if="!projectData.deleted_at" class="project-details__information">
      <div class="project-details__information-sidebar">
        <div class="project-details__information-sidebar-item">
          <div class="project-details__information-sidebar-item-header">
            <span class="project-details__information-sidebar-item-header-icon fas fa-cogs"></span>
            <span class="project-details__information-sidebar-item-header-name">technology</span>
          </div>
          <div class="project-details__information-sidebar-item-data" style="text-align: center;">
            <div class="project-details__bubble">
              <img :src="projectTypeImage" alt="Technology Logo" class="project-details__bubble-image"></img>
              <span class="project-details__bubble-text">{{ projectType }}</span>
            </div>
          </div>
        </div>
        <div class="project-details__information-sidebar-item">
          <div class="project-details__information-sidebar-item-header">
            <span class="project-details__information-sidebar-item-header-icon fas fa-user-circle"></span>
            <span class="project-details__information-sidebar-item-header-name">author</span>
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
            <span class="project-details__information-sidebar-item-header-name">dojo</span>
          </div>
          <div class="project-details__information-sidebar-item-data" style="text-align: center;">
            <div class="project-details__bubble" @click="viewDojo(dojoData.id)">
              <img src="@/assets/cd-logo.png" alt="Dojo Logo" class="project-details__bubble-image--link"></img>
              <span class="project-details__bubble-text">{{ dojoData.name }}</span>
            </div>
          </div>
        </div>
        <div class="project-details__information-sidebar-item">
          <div class="project-details__information-sidebar-item-header">
            <span class="project-details__information-sidebar-item-header-icon fa fa-code"></span>
            <span class="project-details__information-sidebar-item-header-name">source code</span>
          </div>
          <div class="project-details__information-sidebar-item-data">
            <div class="project-details__information-sidebar-item-data-link">
              <a :href="projectData.github_url" target="_blank">
                <span class="project-details__information-sidebar-item-data-link-text">View source code</span>
                <span class="project-details__information-sidebar-item-data-link-icon fas fa-external-link-alt"></span>
              </a>
            </div>
          </div>
        </div>
        <div v-if="projectData.resource_url" class="project-details__information-sidebar-item">
          <div class="project-details__information-sidebar-item-header">
            <span class="project-details__information-sidebar-item-header-icon fas fa-wrench"></span>
            <span class="project-details__information-sidebar-item-header-name">resources</span>
          </div>
          <div class="project-details__information-sidebar-item-data">
            <div class="project-details__information-sidebar-item-data-link">
              <a :href="projectData.resource_url" target="_blank">
                <span class="project-details__information-sidebar-item-data-link-text">View resources</span>
                <span class="project-details__information-sidebar-item-data-link-icon fas fa-external-link-alt"></span>
              </a>
            </div>
          </div>
        </div>
        <div class="project-details__information-sidebar-item">
          <div class="project-details__information-sidebar-item-header">
            <span class="project-details__information-sidebar-item-header-icon far fa-clock"></span>
            <span class="project-details__information-sidebar-item-header-name">last updated</span>
          </div>
          <div class="project-details__information-sidebar-item-data">
            <span>Last updated at <strong>{{ lastUpdatedTime }}</strong> on the <strong>{{ lastUpdatedDate }}</strong></span>
          </div>
        </div>
      </div>
      <div class="project-details__information-content">
        <div class="project-details__information-content-actions">
          <button class="project-details__information-content-actions-button" @click="isSharing = !isSharing" v-bind:class="{'project-details__information-content-actions-button-sharing': isSharing}">
            <span class="fas fa-share-alt"></span>
          </button>
          <button v-if="currentUser || isLoggedInUserCDFAdmin" class="project-details__information-content-actions-button" @click="editProject()">
            <span class="fas fa-edit"></span>
          </button>
        </div>
        <transition name="pop">
          <div v-if="isSharing" class="project-details__information-content-share">
            <div class="project-details__information-content-share-title">
              Share {{ projectData.name }} with the world!
            </div>
            <div class="project-details__information-content-share-url">
              <input class="project-details__information-content-share-url-input" :value="fullUrl" onFocus="this.select()"></input>
              <button class="project-details__information-content-share-url-copy fas fa-copy" v-clipboard:copy="fullUrl"></button>
            </div>
          </div>
        </transition>
        <div class="project-details__information-content-section">
          <div class="project-details__information-content-section-title">
            Try it out!
          </div>
          <div class="project-details__information-content-section-content">
            <div v-if="projectData.type === 'html'" class="project-details__information-content-section-content-webpage">
              <div class="project-details__information-content-section-content-webpage-information">
                <div class="project-details__information-content-section-content-webpage-information-link">
                  <a :href="githubPagesLink" target="_blank">
                    <span class="project-details__information-content-section-content-webpage-information-link-text">Visit the website</span>
                    <span class="project-details__information-content-section-content-webpage-information-link-icon fas fa-external-link-alt"></span>
                  </a>
                </div>
                <div v-if="projectData.plays" class="project-details__information-content-section-content-webpage-information-plays">
                  <span class="project-details__information-content-section-content-webpage-information-plays-number">{{ formattedPlays }}</span>
                  <span class="project-details__information-content-section-content-webpage-information-plays-word">Plays</span>
                </div>
              </div>
              <iframe class="project-details__information-content-section-content-webpage-window" :src="githubPagesLink"></iframe>
            </div>
            <div v-else class="project-details__information-content-section-content-run">
              <div class="project-details__information-content-section-content-run-information">
                <div class="project-details__information-content-section-content-run-information-message">
                  <span>Click the button below to try out {{ projectData.name }}!</span>
                </div>
                <div v-if="projectData.plays" class="project-details__information-content-section-content-run-information-plays">
                  <span class="project-details__information-content-section-content-run-information-plays-number">{{ formattedPlays }}</span>
                  <span class="project-details__information-content-section-content-run-information-plays-word">Plays</span>
                </div>
              </div>
              <div class="project-details__information-content-section-content-run-button">
                <router-link class="primary-button" :to="{ name: 'ProjectRuntime', params: { projectId: projectData.project_id } }"><span class="project-details__information-content-section-content-run-button-icon fas fa-play"></span>Play</router-link>
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
      </div>
    </div>
    <div v-else class="project-details__deleted">
      <div class="project-details__deleted-box">
        <div class="project-details__deleted-box-message">
          <span class="project-details__deleted-box-message-icon fas fa-ban"></span>
          <span class="project-details__deleted-box-message-text">This project was deleted!</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  import projectService from '@/projects/service';
  import dojoService from '@/dojos/service';
  import userService from '@/users/service';

  export default {
    name: 'ProjectDetails',
    data() {
      return {
        projectData: null,
        dojoData: null,
        currentUser: null,
        isLoggedInUserCDFAdmin: false,
        fullUrl: window.location.href,
        isSharing: false,
      };
    },
    computed: {
      // returns the path to the image for each project type
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
      // returns the type name for each project type
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
      // returns the projects last updated time in a readable format in the users timezone
      lastUpdatedTime() {
        return moment(this.projectData.updated_at || this.projectData.created_at).add(moment().utcOffset(), 'minutes').format('h:mma');
      },
      // returns the projects last updated date in a readable format in the users timezone
      lastUpdatedDate() {
        return moment(this.projectData.updated_at || this.projectData.created_at).add(moment().utcOffset(), 'minutes').format('Do of MMMM YYYY');
      },
      // returns the link to this project on GitHub pages (for HTML5 projects)
      githubPagesLink() {
        let githubAccount = this.projectData.github_url.split('/');
        githubAccount = githubAccount[githubAccount.length - 2]
        return `https://${githubAccount}.github.io/${this.projectData.project_id}`;
      },
      // returns the number of plays formatted for viewing in the users locale
      formattedPlays() {
        return parseInt(this.projectData.plays).toLocaleString();
      },
    },
    methods: {
      // redirects to the edit project page for this project
      editProject() {
        this.$router.push(`/edit-project/${this.projectData.project_id}`);
      },
      // redirects to the Dojo details page for the given Dojo id
      viewDojo(dojoId) {
        this.$router.push(`/dojos/${dojoId}`);
      },
    },
    async created() {
      // get project data by id
      const projectId = this.$route.params.projectId;
      this.projectData = (await projectService.getProjectById(projectId)).body;
      // get project plays by id
      const projectStatistics = (await projectService.getProjectStatisticsById(projectId)).body;
      this.projectData.plays = projectStatistics.plays;
      // if the project is a HTML5 project, increment the plays for the project
      if (this.projectData.type === 'html') {
        await projectService.incrementProjectPlays(projectId);
      }
      // get dojo data using the GitHub integration id
      this.dojoData = (await dojoService.getDojoByGitHubId(this.projectData.github_integration_id)).body;
      // check if the logged in user owns this project or is CDF Admin
      const loggedInUserId = this.$cookie.get('loggedIn');
      if (this.projectData.user_id === loggedInUserId) {
        this.currentUser = loggedInUserId;
      }
      this.isLoggedInUserCDFAdmin = (await userService.isUserCDFAdmin(loggedInUserId)).body;
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
              &-icon {
                font-size: 14px;
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
            &-sharing {
              border-bottom-left-radius: 0;
              border-bottom-right-radius: 0;
              color: #FFFFFF;
              background-color: #73449B;
            }
          }
        }
        &-share {
          margin-bottom: 16px;
          padding: 24px 16px 32px 16px;
          color: #FFFFFF;
          background-color: #73449B;
          &-title {
            margin-bottom: 16px;
            font-size: 24px;
          }
          &-url {
            display: flex;
            &-input {
              flex: 11;
              padding: 8px 12px;
              border-right: none;
              border-radius: 0;
              &:focus {
                outline: none;
              }
            }
            &-copy {
              flex: 0.5;
              margin-right: 16px;
              padding: 8px;
              font-size: 16px;
              background-color: #FFFFFF;
              color: #2c3e50;
              border: solid 0.5px #99999F;
              border-left: none;
              border-radius: none;
              &:hover {
                cursor: pointer;
              }
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
              &-information {
                display: flex;
                align-items: flex-end;
                &-link {
                  flex: 10;
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
                &-plays {
                  &-number {
                    font-size: 24px;
                  }
                  &-word {
                    color: #99999F;
                  }
                }
              }
              &-window {
                margin-top: 10px;
                width: 100%;
                height: 600px;
                border: solid 3px #FAA31A;
                border-bottom: solid 4px #FAA31A;
              }
            }
            &-run {
              &-information {
                display: flex;
                &-message {
                  flex: 10;
                }
                &-plays {
                  &-number {
                    font-size: 24px;
                  }
                  &-word {
                    color: #99999F;
                  }
                }
              }
              &-button {
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
    }
    &__bubble {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      margin-top: 10px;
      &-image {
        width: 92px;
        height: 92px;
        &--link {
          width: 92px;
          height: 92px;
          border: solid 7px #f8f8f8;
          border-radius: 70px;
          &:hover {
            background-color: #73449B;
            border: solid 7px #73449B;
            border-radius: 70px;
            cursor: pointer;
            transition: border 0.3s ease-out;
          }
        }
      }
      &-text {
        padding-top: 8px;
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