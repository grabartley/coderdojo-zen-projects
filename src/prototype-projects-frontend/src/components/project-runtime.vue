<template>
  <div class="project-runtime">
    <div class="project-runtime__overlay" ref="overlay">
      <button id="runtime-overlay-runButton" @click="runProject()">Run Project</button>
    </div>
    <div class="project-runtime__header">Project Name</div>
    <div class="project-runtime__terminal" ref="terminal"></div>
  </div>
</template>

<script>
import Terminal from 'xterm2';

export default {
  name: 'ProjectRuntime',
  data() {
    return {
      projectId: null,
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
      this.$refs.overlay.style.visibility = 'hidden';
      this.$refs.overlay.style.opacity = '1';
      
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
      this.$socket.emit('start', this.projectId);
      
      // when a command is entered
      this.term.on('data', (data) => {
        // send it to the server
        this.$socket.emit('command', data);
      });
    },
  },
  created() {
    this.projectId = this.$route.params.id;
  },
}
</script>

<style scoped lang="less">
  .project-runtime {
    &__overlay {
      opacity: 0.9;
      background-color: black;
      position: fixed;
      padding: 0;
      margin: 0;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      text-align: center;
      transition: opacity 0.5s linear;
      
      & button {
        color: white;
        margin-top: 460px;
        border: none;
        font-size: 2em;
        font-weight: bold;
        background-color: #0066cc;
        padding: 20px 30px;
        border-radius: 20px;
        
        &:hover {
          background-color: #1a8cff;
          cursor: pointer;
        }
      }
    }
    
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