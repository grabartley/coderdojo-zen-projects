<template>
  <div class="project-list">
    <div class="project-list__banner">
      <span class="project-list__banner-title">Projects</span>
    </div>
    <div class="project-list__content">
      <div class="project-list__content-groups">
        <div class="project-list__content-groups-box">
          <div class="project-list__content-groups-box-header">
            <span class="project-list__content-groups-box-header-icon fas fa-rocket"></span>
            <span class="project-list__content-groups-box-header-title">Most Played</span>
          </div>
          <ol class="project-list__content-groups-box-list">
            <div v-for="project in mostPlayedProjects" class="project-list__content-groups-box-list-container">
              <li class="project-list__content-groups-box-list-item">
                <router-link :to="{ name: 'ProjectDetails', params: { projectId: project.project_id } }">{{ project.name }}</router-link>
              </li>
              <span class="project-list__content-groups-box-list-metadata">{{ project.plays }}</span>
            </div>
          </ol>
        </div>
        <div class="project-list__content-groups-box">
          <div class="project-list__content-groups-box-header">
            <span class="project-list__content-groups-box-header-icon far fa-clock"></span>
            <span class="project-list__content-groups-box-header-title">Recently Updated</span>
          </div>
          <ol class="project-list__content-groups-box-list">
            <li v-for="project in recentlyUpdatedProjects" class="project-list__content-groups-box-list-item">
              <router-link :to="{ name: 'ProjectDetails', params: { projectId: project.project_id } }">{{ project.name }}</router-link>
            </li>
          </ol>
        </div>
        <div class="project-list__content-groups-box">
          <div class="project-list__content-groups-box-header">
            <span class="project-list__content-groups-box-header-icon fas fa-certificate"></span>
            <span class="project-list__content-groups-box-header-title">Newly Created</span>
          </div>
          <ol class="project-list__content-groups-box-list">
            <li v-for="project in newlyCreatedProjects" class="project-list__content-groups-box-list-item">
              <router-link :to="{ name: 'ProjectDetails', params: { projectId: project.project_id } }">{{ project.name }}</router-link>
            </li>
          </ol>
        </div>
      </div>
      <div class="project-list__content-projects">
        <div class="project-list__content-projects-search">
          <input class="project-list__content-projects-search-input" placeholder="Search projects..."></input>
          <button class="project-list__content-projects-search-button fa fa-search"></button>
        </div>
        <div class="project-list__content-projects-list">
          <div class="project-list__content-projects-list-message">
            Showing {{ firstOnPage }} to {{ lastOnPage }} of {{ projectData.length }} projects
          </div>
          <div class="project-list__content-projects-list-container">
            <div class="project-list__content-projects-list-items">
              <div v-for="project in paginatedProjectData" class="project-list__content-projects-list-items-item">
                <div class="project-list__content-projects-list-items-item-name">
                  <router-link :to="{ name: 'ProjectDetails', params: { projectId: project.project_id } }">{{ project.name }}</router-link>
                </div>
                <div class="project-list__content-projects-list-items-item-description">
                  <label>{{ project.description }}</label>
                </div>
              </div>
            </div>
            <div v-if="loggedInUser && loggedInUser.type === 'youth-o13'" class="project-list__content-projects-list-box">
              <div class="project-list__content-projects-list-box-message">Got an idea to share?</div>
              <button class="project-list__content-projects-list-box-button" @click="createProject">
                <span>Create a Project</span>
              </button>
            </div>
          </div>
          <pagination :records="projectData.length" :per-page="projectsPerPage" ref="pagination" for="projects-pagination" :options="{ texts: { count: '||' }, edgeNavigation: true }"></pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Pagination, PaginationEvent } from 'vue-pagination-2';
import projectService from '@/projects/service';
import userService from '@/users/service';

export default {
  name: 'ProjectList',
  data() {
    return {
      projectData: [],
      mostPlayedProjects: [],
      recentlyUpdatedProjects: [],
      newlyCreatedProjects: [],
      loggedInUser: null,
      projectsPerPage: 6,
      currentPage: 1,
    };
  },
  components: {
    Pagination,
  },
  computed: {
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
    // redirect the user to the Project Creation Form
    createProject() {
      this.$router.push('/create-project');
    },
  },
  async created() {
    // get the project data to display in the list
    this.projectData = (await projectService.getProjectData()).body;
    
    // get the most played projects
    this.mostPlayedProjects = (await projectService.getProjectData(false, 'plays', 'desc', 5)).body;
    
    // get the recently updated projects
    this.recentlyUpdatedProjects = (await projectService.getProjectData(false, 'updated_at', 'desc', 5)).body;
    
    // get the newly created projects
    this.newlyCreatedProjects = (await projectService.getProjectData(false, 'created_at', 'desc', 5)).body;
    
    // get the logged in user (if there is one)
    const userId = this.$cookies.get('loggedIn');
    if (userId) {
      this.loggedInUser = (await userService.getUserData(userId)).body;
    }
    
    // pagination event handler
    PaginationEvent.$on('vue-pagination::projects-pagination', (page) => {
      this.currentPage = page;
    });
  },
}
</script>
<style scoped lang="less">
  .project-list {
    &__banner {
      padding: 25px 20px;
      color: white;
      background-color: #73449B;
      &-title {
        margin-left: 16px;
        font-size: 30px;
      }
    }
    &__content {
      &-groups {
        display: flex;
        margin: 16px;
        text-align: left;
        &-box {
          flex: 4;
          padding: 8px 16px;
          margin: 16px 16px;
          border: solid 1px #FAA31A;
          border-bottom: solid 2px #FAA31A;
          &-header {
            display: flex;
            align-items: center;
            margin-top: 4px;
            color: #73449B;
            &-icon {
              font-size: 24px;
            }
            &-title {
              margin-left: 16px;
              font-size: 19px;
              font-weight: bold;
            }
          }
          &-list {
            margin-top: 16px;
            padding-left: 20px;
            &-container {
              display: flex;
              align-items: center;
            }
            &-item {
              margin: 4px 0;
              & a {
                margin-left: 8px;
                color: #0093D5;
                text-decoration: none;
                &:hover {
                  text-decoration: underline;
                  color: #005e89;
                }
              }
            }
            &-metadata {
              margin-left: auto;
              font-size: 18px;
              font-weight: 600;
              color: #73449B;
            }
          }
        }
      }
      &-projects {
        &-search {
          margin: 0 48px;
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
          &-button {
            flex: 0.5;
            padding: 8px;
            font-size: 16px;
            background-color: #FFFFFF;
            border: solid 0.5px #99999F;
            border-left: none;
            border-radius: none;
            &:hover {
              cursor: pointer;
            }
          }
        }
        &-list {
          margin: 0 64px;
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
          &-box {
            flex: 3;
            margin: 64px 16px 64px 64px;
            padding: 8px 16px;
            min-height: 150px;
            max-height: 150px;
            border: solid 1px #FAA31A;
            border-bottom: solid 2px #FAA31A;
            &-message {
              margin-top: 24px;
              font-size: 18px;
            }
            &-button {
              margin-top: 20px;
              padding: 10px 4px;
              width: 160px;
              height: 40px;
              font-size: 18px;
              color: #FAA31A;
              background-color: #FFFFFF;
              border: solid 1px #FAA31A;
              &:hover {
                color: #FFFFFF;
                background-color: #FAA31A;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
</style>