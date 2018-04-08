<template>
  <div class="admin-panel">
    <div v-if="dojoData" class="admin-panel__banner">
      <div class="admin-panel__banner-title">{{ dojoData.name }}</div>
      <div class="admin-panel__banner-subtitle">Administrator Panel</div>
    </div>
    <div class="admin-panel__content">
      <div v-if="projectData" class="admin-panel__content-section">
        <div class="admin-panel__content-section-title">
          Manage Projects
        </div>
        <div class="admin-panel__content-section-content">
          <div class="admin-panel__content-section-content-message">
            Manage projects created by Ninjas in your Dojo here.
          </div>
          <div class="admin-panel__content-section-content-projects">
            <div class="admin-panel__content-section-content-projects-search">
              <input class="admin-panel__content-section-content-projects-search-input" v-model="searchQuery" placeholder="Search projects..."></input>
              <span class="admin-panel__content-section-content-projects-search-icon fa fa-search"></span>
            </div>
            <div class="admin-panel__content-section-content-projects-list">
              <div class="admin-panel__content-section-content-projects-list-message">
                Showing {{ firstOnPage }} to {{ lastOnPage }} of {{ projectData.length }} projects
              </div>
              <div class="admin-panel__content-section-content-projects-list-container">
                <div class="admin-panel__content-section-content-projects-list-items">
                  <div v-for="project in paginatedProjectData" class="admin-panel__content-section-content-projects-list-items-item">
                    <div class="admin-panel__content-section-content-projects-list-items-item-information">
                      <router-link class="admin-panel__content-section-content-projects-list-items-item-information-name" :to="{ name: 'ProjectDetails', params: { projectId: project.project_id } }">
                        {{ project.name }}
                      </router-link>
                      <div class="admin-panel__content-section-content-projects-list-items-item-information-description">{{ project.description }}</div>
                    </div>
                    <div class="admin-panel__content-section-content-projects-list-items-item-actions">
                      <button class="admin-panel__content-section-content-projects-list-items-item-actions-button" @click="editProject(project.project_id)">
                        <span class="fas fa-edit"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="admin-panel__content-section-content-projects-list-paginator">
                <pagination :records="projectData.length" :per-page="projectsPerPage" ref="pagination" for="projects-pagination" :options="{ texts: { count: '||' }, edgeNavigation: true }"></pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="admin-panel__content-section">
        <div class="admin-panel__content-section-title">
          GitHub Integration
        </div>
        <div v-if="!isGitHubIntegrated" class="admin-panel__content-section-content">
          <div class="admin-panel__content-section-content-message">
            Integrating GitHub will allow Ninjas in your Dojo to create projects! You will need to create a GitHub account specifically for this Dojo which will be used to store the code for their projects. Follow the link below and sign in with the GitHub login you created to integrate.
          </div>
          <div class="admin-panel__content-section-content-link">
            <a :href="githubAuthUrl" target="_blank">
              <span class="admin-panel__content-section-content-link-text">Integrate GitHub Account</span>
              <span class="admin-panel__content-section-content-link-icon fas fa-external-link-alt"></span>
            </a>
          </div>
        </div>
        <div v-else class="admin-panel__content-section-content">
          <div class="admin-panel__content-section-content-message">
            GitHub is integrated for this Dojo!
          </div>
          <div class="admin-panel__content-section-content-danger">
            <button v-if="!removingGitHubConfirmation" class="admin-panel__content-section-content-danger-button danger-button" @click="removingGitHubConfirmation = true">
              <span>Remove GitHub Integration</span>
            </button>
            <button v-else class="admin-panel__content-section-content-danger-button danger-button" v-bind:class="{'admin-panel__content-section-content-danger-button--spinning': removingGitHubIntegration}" @click="removeGitHubIntegration">
              <span v-if="removingGitHubIntegration" class="fa fa-spinner fa-spin"></span>
              <span v-else>Confirm Removal</span>
            </button>
            <div class="admin-panel__content-section-content-danger-message">
              <span class="admin-panel__content-section-content-danger-message-emphasis">warning:</span>
              <span>Removing the GitHub integration for this Dojo will permanently delete all projects associated with it and Ninjas in your Dojo will not be able to create projects again until a new integration has been made!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { Pagination, PaginationEvent } from 'vue-pagination-2';
  import dojoService from '@/dojos/service';
  import projectService from '@/projects/service';
  import userService from '@/users/service';

  export default {
    name: 'AdminPanel',
    data() {
      return {
        isLoggedInUserChampion: false,
        isGitHubIntegrated: false,
        dojoData: null,
        projectData: null,
        fullProjectData: null,
        projectsPerPage: 6,
        currentPage: 1,
        searchQuery: '',
        removingGitHubConfirmation: false,
        removingGitHubIntegration: false,
        githubClientId: process.env.GITHUB_CLIENT_ID,
      };
    },
    components: {
      Pagination,
    },
    computed: {
      // url to start GitHub integration (localhost for now)
      githubAuthUrl() {
        return `https://github.com/login/oauth/authorize?scope=public_repo&client_id=${this.githubClientId}&redirect_uri=http://localhost:8080/dojos/integrations/github?dojoId=${this.$route.params.dojoId}`;
      },
      paginatedProjectData() {
        const firstIndex = (this.currentPage - 1) * this.projectsPerPage;
        const lastIndex = firstIndex + this.projectsPerPage;
        return this.projectData.slice(firstIndex, lastIndex);
      },
      firstOnPage() {
        return 1 + (this.projectsPerPage * (this.currentPage - 1));
      },
      lastOnPage() {
        let result = this.firstOnPage + (this.projectsPerPage - 1);
        return result <= this.projectData.length ? result : this.projectData.length;
      },
    },
    methods: {
      editProject(projectId) {
        this.$router.push(`/edit-project/${projectId}`);
      },
      async removeGitHubIntegration() {
        // if not already removing GitHub integration
        if (!this.removingGitHubIntegration) {
          this.removingGitHubIntegration = true;
          await dojoService.removeGitHubIntegration(this.$route.params.dojoId);
          this.$router.go();
        }
      },
    },
    async created() {
      const dojoId = this.$route.params.dojoId;
      
      // check is the logged in user a champion of this dojo
      const loggedInUserId = this.$cookies.get('loggedIn');
      this.isLoggedInUserChampion = (await userService.isUserChampion(loggedInUserId, dojoId)).body;
      
      // redirect user away if they are not authorized to be here
      if (!this.isLoggedInUserChampion) {
        this.$router.push('/');
      }
      
      // get the dojo data
      this.dojoData = (await dojoService.getDojoById(dojoId)).body;
      
      // check if GitHub has been integrated for this dojo
      this.isGitHubIntegrated = (await dojoService.isGitHubIntegrated(dojoId)).body;
      
      // get the projects for this dojo
      if (this.isGitHubIntegrated) {
        this.projectData = (await projectService.getProjectsForDojo(dojoId, true)).body;
        this.fullProjectData = this.projectData;
      }
      
      // pagination event handler
      PaginationEvent.$on('vue-pagination::projects-pagination', (page) => {
        this.currentPage = page;
      });
    },
    watch: {
      searchQuery: {
        handler(newSearchQuery, prevSearchQuery) {
          const searchQuery = newSearchQuery.toUpperCase();
          let newProjectData = [];
          this.fullProjectData.forEach((project) => {
            if (project.name.toUpperCase().includes(searchQuery) || project.description.toUpperCase().includes(searchQuery)) {
              newProjectData.push(project);
            }
          });
          this.projectData = newProjectData;
        },
      },
    },
  }
</script>
<style scoped lang="less">
  .admin-panel {
    &__banner {
      padding: 25px 20px;
      color: white;
      background-color: #73449B;
      &-title {
        font-size: 30px;
      }
      &-subtitle {
        margin-top: 4px;
        font-size: 20px;
      }
    }
    &__content {
      padding: 40px 30px 10px 30px;
      text-align: left;
      &-section {
        margin-bottom: 40px;
        &-title {
          font-size: 20px;
          color: #0093D5;
          border-bottom: 1px solid #99999F;
        }
        &-content {
          margin-top: 14px;
          &-message {
          }
          &-link {
            margin-top: 24px;
            &-icon {
              font-size: 14px;
            }
          }
          &-projects {
            &-search {
              margin: 32px 16px;
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
              &-icon {
                flex: 0.3;
                padding: 8px;
                font-size: 16px;
                border: solid 0.5px #99999F;
                border-left: none;
                border-radius: none;
              }
            }
            &-list {
              margin: 0 32px;
              margin-top: 32px;
              &-message {
                margin-bottom: 16px;
                color: #bdbfbf;
              }
              &-container {
                display: flex;
              }
              &-items {
                flex: 11;
                &-item {
                  display: flex;
                  align-items: center;
                  padding: 16px;
                  border-bottom: solid 1px #bdbfbf;
                  &:first-child {
                    border-top: solid 1px #bdbfbf;
                  }
                  &-information {
                    flex: 10;
                    margin-right: 30px;
                    & a {
                      color: #0093D5;
                      text-decoration: none;
                      &:hover {
                        text-decoration: underline;
                        color: #005e89;
                      }
                    }
                    &-description {
                      margin-top: 4px;
                    }
                  }
                  &-actions {
                    flex: 1;
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
                }
              }
              &-paginator {
                text-align: center;
              }
            }
          }
          &-danger {
            display: flex;
            align-items: center;
            margin-top: 16px;
            &-button {
              height: 45px;
              width: 220px;
              font-size: 14px;
              &--spinning {
                width: 50px;
                transition: 0.3s;
              }
            }
            &-message {
              flex: 1;
              margin: 0 32px;
              &-emphasis {
                margin-right: 4px;
                text-transform: uppercase;
                font-weight: bold;
                color: #9B1C20;
              }
            }
          }
        }
      }
    }
  }
</style>