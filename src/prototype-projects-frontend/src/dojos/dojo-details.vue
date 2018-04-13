<template>
  <div v-if="dojoData" class="dojo-details">
    <div class="dojo-details__banner">
      <span class="dojo-details__banner-title">{{ dojoData.name }}</span>
    </div>
    <div class="dojo-details__information">
      <div class="dojo-details__information-sidebar">
        <div class="dojo-details__information-sidebar-item">
          <div class="dojo-details__information-sidebar-item-header">
            <span class="fab fa-github"></span>
            <span>github integration</span>
          </div>
          <div v-if="isGitHubIntegrated" class="dojo-details__information-sidebar-item-data">
            GitHub is integrated for this Dojo!
          </div>
          <div v-else class="dojo-details__information-sidebar-item-data">
            GitHub has not been integrated for this Dojo!
          </div>
        </div>
      </div>
      <div class="dojo-details__information-content">
        <div class="dojo-details__information-content-actions">
          <button v-if="isLoggedInUserChampion" class="dojo-details__information-content-actions-button" @click="adminPanel">
            <span class="fas fa-chart-pie"></span>
          </button>
        </div>
        <div class="dojo-details__information-content-section">
          <div class="dojo-details__information-content-section-title">
            Dojo Information
          </div>
          <div class="dojo-details__information-content-section-content">
            Dojo information goes here!
          </div>
        </div>
        <div v-if="projects" class="dojo-details__information-content-section">
          <div class="dojo-details__information-content-section-title">
            Projects
          </div>
          <div class="dojo-details__information-content-section-content">
            <div class="dojo-details__information-content-section-content-search">
              <input class="dojo-details__information-content-section-content-search-input" v-model="searchQuery" placeholder="Search projects..."></input>
              <span class="dojo-details__information-content-section-content-search-icon fa fa-search"></span>
            </div>
            <div class="dojo-details__information-content-section-content-list">
              <div v-if="paginatedProjectData.length > 0" class="dojo-details__information-content-section-content-list-message">
                Showing {{ firstOnPage }} to {{ lastOnPage }} of {{ projects.length }} projects
              </div>
              <div v-else class="dojo-details__information-content-section-content-list-message">
                No projects found!
              </div>
              <div class="dojo-details__information-content-section-content-list-container">
                <div class="dojo-details__information-content-section-content-list-items">
                  <div v-for="project in paginatedProjectData" class="dojo-details__information-content-section-content-list-items-item">
                    <div class="dojo-details__information-content-section-content-list-items-item-name">
                      <router-link :to="{ name: 'ProjectDetails', params: { projectId: project.project_id } }">{{ project.name }}</router-link>
                    </div>
                    <div class="dojo-details__information-content-section-content-list-items-item-description">
                      <label>{{ project.description }}</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="dojo-details__information-content-section-content-list-paginator">
                <pagination :records="projects.length" :per-page="projectsPerPage" ref="pagination" for="projects-pagination" :options="{ texts: { count: '||' }, edgeNavigation: true }"></pagination>
              </div>
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
  import userService from '@/users/service';
  import projectService from '@/projects/service';

  export default {
    name: 'DojoDetails',
    data() {
      return {
        dojoData: null,
        isGitHubIntegrated: false,
        isLoggedInUserChampion: false,
        projects: [],
        fullProjectData: [],
        projectsPerPage: 6,
        currentPage: 1,
        searchQuery: '',
      };
    },
    components: {
      Pagination,
    },
    computed: {
      paginatedProjectData() {
        const firstIndex = (this.currentPage - 1) * this.projectsPerPage;
        const lastIndex = firstIndex + this.projectsPerPage;
        return this.projects.slice(firstIndex, lastIndex);
      },
      firstOnPage() {
        return 1 + (this.projectsPerPage * (this.currentPage - 1));
      },
      lastOnPage() {
        let result = this.firstOnPage + (this.projectsPerPage - 1);
        return result <= this.projects.length ? result : this.projects.length;
      },
    },
    methods: {
      // redirects the user to the admin panel for this Dojo
      adminPanel() {
        this.$router.push(`/admin-panel/${this.$route.params.dojoId}`);
      },
    },
    async created() {
      const dojoId = this.$route.params.dojoId;
      // get dojo data
      this.dojoData = (await dojoService.getDojoById(dojoId)).body;
      // check if GitHub has been integrated for this dojo
      this.isGitHubIntegrated = (await dojoService.isGitHubIntegrated(dojoId)).body;
      // check is the logged in user a champion of this dojo
      const loggedInUserId = this.$cookie.get('loggedIn');
      this.isLoggedInUserChampion = (await userService.isUserChampion(loggedInUserId, dojoId)).body;
      // get projects for this Dojo
      this.projects = (await projectService.getProjectsForDojo(dojoId, false)).body;
      this.fullProjectData = this.projects;
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
          this.projects = newProjectData;
        },
      },
    },
  }
</script>
<style scoped lang="less">
  .dojo-details {
    &__banner {
      padding: 25px 20px;
      color: white;
      background-color: #73449B;
      &-title {
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
            &-search {
              margin: 32px 16px;
              display: flex;
              margin-bottom: 16px;
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
                flex: 0.5;
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
                padding-bottom: 4px;
                text-align: left;
                color: #bdbfbf;
                border-bottom: solid 1px #bdbfbf;
              }
              &-container {
                display: flex;
              }
              &-items {
                flex: 10;
                &-item {
                  margin: 16px 0;
                  text-align: left;
                  &-name {
                    margin-bottom: 4px;
                    & a {
                      color: #0093D5;
                      text-decoration: none;
                      &:hover {
                        text-decoration: underline;
                        color: #005e89;
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
        }
      }
    }
  }
</style>