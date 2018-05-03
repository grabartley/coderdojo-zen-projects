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
      const projectData = (await dbService.query({
        text: 'SELECT * FROM projects WHERE project_id=$1;',
        values: [projectId],
      })).rows[0];
      // used to signify the first output from the project process
      let firstOutput = true;
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
      const projectProcess = pty.spawn('./scripts/run-project', [projectData.github_url, projectData.entrypoint, imageTag]);
      // when anything is outputted by the process
      projectProcess.on('data', (data) => {
        // emit special event for first output from project process
        if (firstOutput) {
          socket.emit('firstOutput');
          firstOutput = false;
        }
        // emit it to the client to display
        socket.emit('output', data);
      });
      // when a command is received from the frontend
      socket.on('command', (data) => {
        // execute it in the running container
        projectProcess.write(data);
      });
      // when a stop event is emitted by the frontend
      socket.on('stop', () => {
        // kill the running process
        projectProcess.destroy();
      });
      // when the connection is lost
      socket.on('disconnect', () => {
        // kill the running process
        projectProcess.destroy();
      });
    });
  });  
}

module.exports = {
  setupSockets: setupSockets,
};