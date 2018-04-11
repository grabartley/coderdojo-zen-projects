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
      </div>
    </div>
  </div>
</template>
<script>
  import dojoService from '@/dojos/service';
  import userService from '@/users/service';

  export default {
    name: 'DojoDetails',
    data() {
      return {
        dojoData: null,
        isGitHubIntegrated: false,
        isLoggedInUserChampion: false,
      };
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
          }
        }
      }
    }
  }
</style>