<template>
  <div v-if="userData" class="edit-profile">
    <div class="edit-profile__banner">
      <span class="edit-profile__banner-title">{{ userData.name }}</span>
    </div>
    <div class="edit-profile__information">
      <div class="edit-profile__information-sidebar">
        <div class="edit-profile__information-sidebar-item">
          <div class="edit-profile__information-sidebar-item-header">
            <span class="fas fa-envelope"></span>
            <span>email</span>
          </div>
          <div class="edit-profile__information-sidebar-item-data">
            <span>{{ userData.email }}</span>
          </div>
        </div>
      </div>
      <div class="edit-profile__information-content">
        <div class="edit-profile__information-content-actions">
          <button class="edit-profile__information-content-actions-button" @click="viewProfile">
            <span class="fas fa-eye"></span>
          </button>
        </div>
        <div v-if="userData.type === 'champion'" class="edit-profile__information-content-section">
          <div class="edit-profile__information-content-section-title">
            GitHub Integration
          </div>
          <div class="edit-profile__information-content-section-content">
            <div>
              Integrating GitHub will allow Ninjas in your Dojo to create projects! You will need a GitHub account which will be used to host the code for their projects.
            </div>
            <div class="edit-profile__information-content-section-content-link">
              <a :href="githubAuthUrl" target="_blank">
                <span class="edit-profile__information-content-section-content-link-text">Integrate GitHub Account</span>
                <span class="edit-profile__information-content-section-content-link-icon fas fa-external-link-alt"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import userService from '@/users/service';

  export default {
    name: 'EditProfile',
    data() {
      return {
        userData: null,
        githubClientId: process.env.GITHUB_CLIENT_ID,
      };
    },
    computed: {
      githubAuthUrl() {
        return `https://github.com/login/oauth/authorize?scope=public_repo&client_id=${this.githubClientId}`;
      },
    },
    methods: {
      viewProfile() {
        this.$router.push(`/view-profile/${this.userData.id}`);
      },
    },
    async created() {
      const userId = this.$route.params.userId;
      this.userData = await userService.getUserData(userId);
      this.userData = this.userData.body;
    },
  }
</script>
<style scoped lang="less">
  .edit-profile {
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
            &-link {
              margin-top: 24px;
              &-icon {
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
</style>