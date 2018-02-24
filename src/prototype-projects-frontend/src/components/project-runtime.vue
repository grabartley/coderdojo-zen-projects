<template>
  <div class="project-runtime">
    <div v-if="projectData" class="project-runtime__header">{{ projectData.name }}</div>
    <div class="project-runtime__terminal" ref="terminal"></div>
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
      projectRunning: false,
    };
  },
  sockets: {
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
      // instansiate the terminal
      this.term = new Terminal({
        cursorBlink: true,
        cols: 120,
        rows: 50
      });
      
      // open the terminal
      this.term.open(this.$refs.terminal, true);
      
      // a project is now running
      this.projectRunning = true;
      
      // tell the backend to spawn a container for this project
      this.$socket.emit('start', this.projectData.project_id);
      
      // when a command is entered
      this.term.on('data', (data) => {
        // send it to the server
        this.$socket.emit('command', data);
      });
    },
  },
  async created() {
    this.projectData = (await projectService.getProjectById(this.$route.params.id)).body;
    this.runProject();
  },
}
</script>

<style scoped lang="less">
  .project-runtime {
    &__header {
      font-size: 2em;
      font-weight: 300;
      padding: 20px;
      text-align: center;
    }
    
    &__terminal {
      background-color: black;
      padding: 10px 10px 10px 10px;
      margin: 0 40px;
      min-height: 600px;
    }
  }
  body {
    margin: 0;
    background-color: #bfbfbf;
  }
</style>