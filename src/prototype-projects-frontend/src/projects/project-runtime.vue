<template>
  <div class="project-runtime">
    <div v-if="projectData" class="project-runtime__banner">
      <img class="project-runtime__banner-image" src="@/assets/cd-logo.png" alt="Project Image"></img>
      <span class="project-runtime__banner-title">{{ projectData.name }}</span>
      <span class="project-runtime__banner-author">by {{ projectData.author }}</span>
    </div>
    <div class="project-runtime__content">
      <div v-if="projectData" class="project-runtime__content-link">
        <span class="project-runtime__content-link-icon fas fa-angle-left"></span>
        <span class="project-runtime__content-link-text">
          <router-link :to="{ name: 'ProjectDetails', params: { projectId: projectData.project_id } }">Back to Project</router-link>
        </span>
      </div>
      <div v-if="!outputReceived && projectData" class="project-runtime__content-loading">
        <span class="project-runtime__content-loading-spinner fa fa-spinner fa-spin"></span>
        <span class="project-runtime__content-loading-message">Loading {{ projectData.name }}</span>
      </div>
      <transition name="pop">
        <div v-show="outputReceived" class="project-runtime__content-terminal" ref="terminal"></div>
      </transition>
    </div>
  </div>
</template>
<script>
import Terminal from 'xterm2';
import projectService from '@/projects/service';

export default {
  name: 'ProjectRuntime',
  data() {
    return {
      projectData: null,
      term: null,
      outputReceived: false,
      projectRunning: false,
    };
  },
  sockets: {
    // when the first output has been received from the server
    firstOutput() {
      // we have now received output
      this.outputReceived = true;
    },
    // when an output event is emitted by the server
    output(data) {
      // if the terminal exists and a project is running
      if (this.term && this.projectRunning) {
        // write the data to the terminal
        this.term.write(data);
      }
    },
  },
  methods: {
    runProject() {
      // tell the backend to spawn a container for this project
      this.$socket.emit('start', this.projectData.project_id);
      // instansiate the terminal
      this.term = new Terminal({
        cursorBlink: true,
        cols: 120,
        rows: 35
      });
      // open the terminal
      this.term.open(this.$refs.terminal, true);
      // a project is now running
      this.projectRunning = true;
      // when a command is entered
      this.term.on('data', (data) => {
        // send it to the server
        this.$socket.emit('command', data);
      });
    },
  },
  async created() {
    this.projectData = (await projectService.getProjectById(this.$route.params.projectId)).body;
    // don't attempt to run HTML5 projects, redirect back to project list
    if (this.projectData.type === 'html') {
      this.$router.push('/');
    } else {
      // run the project and increment the play counter
      this.runProject();
      await projectService.incrementProjectPlays(this.projectData.project_id);
    }
  },
  destroyed() {
    // tell the server to stop the running container
    this.$socket.emit('stop');
  },
}
</script>
<style scoped lang="less">
  .project-runtime {
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
    &__content {
      margin: 40px 40px;
      &-link {
        margin-bottom: 10px;
        text-align: left;
        font-size: 20px;
        color: #0093D5;
        &-text {
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
      &-loading {
        margin: 32px 0;
        padding: 16px 8px;
        font-size: 20px;
        border: solid 1px #FAA31A;
        border-bottom: solid 2px #FAA31A;
        &-spinner {
          margin-right: 12px;
        }
      }
      &-terminal {
        padding: 10px 10px 15px 10px;
        background-color: black;
        min-height: 600px;
        border: solid 3px #FAA31A;
        border-bottom: solid 4px #FAA31A;
      }
    }
  }
</style>