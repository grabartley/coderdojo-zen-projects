const pty = require('node-pty');
import io from 'socket.io';
import dbService from '../services/db-service';

function setupSockets(server) {
  const IO_SERVER = io(server);
  
  // when a client connects
  IO_SERVER.on('connection', (socket) => {
    // when a start event is emited by the frontend
    socket.on('start', async (projectId) => {
      // get data for this project id
      const projectData = (await dbService.query(`SELECT * FROM projects WHERE project_id='${projectId}';`)).rows[0];
      // used to store the tag of the image to pull
      let imageTag = '';
      // set the image tag to use based on the project type
      switch (projectData.type) {
        case 'python':
          imageTag = 'python3';
          break;
        case 'javascript':
          imageTag = 'nodejs';
          break;
        case 'java':
          imageTag = 'java';
      }
      // spawn a process to run the project
      const term = pty.spawn('./scripts/run-project', [projectData.github_url, projectData.entrypoint, imageTag], {
        name: 'xterm-color'
      });
      // when anything is outputted by the process
      term.on('data', (data) => {
        // emit it to the client to display
        socket.emit('output', data);
      });
      // when a command is received from the frontend
      socket.on('command', (data) => {
        // execute it in the running container
        term.write(data);
      });
      // when a stop event is emitted by the frontend
      socket.on('stop', () => {
        // kill the running process
        term.destroy();
      });
    });
  });  
}

module.exports = {
  setupSockets: setupSockets,
};