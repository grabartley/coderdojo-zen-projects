import pty from 'pty.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import io from 'socket.io';
import http from 'http';
import fs from 'file-system';
import zip from 'adm-zip';

const app = express();
const server = http.createServer(app);
const port = 3000;
const ioServer = io(server);

// used to parse POST data
app.use(bodyParser.urlencoded({ 
  extended: false 
}));
app.use(bodyParser.json());

// used for Cross-Origin Resource Sharing (CORS)
app.use(cors());

// listen on the given port
server.listen(port, () => {
  console.log('Server listening on port ' + port + '!');
});

// when a client connects
ioServer.on('connection', function (socket) {
  // when a start event is emited by the frontend
  socket.on('start', function (data) {
    // spawn a process to create the Docker container
    var term = pty.spawn('./runPythonProject', [], {
      name: 'xterm-color'
    });
    
    // when anything is outputted by the process
    term.on('data', function(data) {
      // emit it to the client to display
      socket.emit('output', data);
      // if the project is finished
      if (data.includes('END OF PROJECT OUTPUT')) {
        // tell the frontend
        socket.emit('stop');
      }
    });
    
    // when a command is received from the frontend
    socket.on('command', function (data) {
      // execute it in the running container
      term.write(data);
    });
  });
});

/* REST API */

// returns all project data (tmp)
app.get('/api/2.0/projects/all-project-data', (req, res) => {
  // log api call
  console.log('GET /api/2.0/projects/all-project-data with ');
  console.log(req.body);
  
  // data structure to be returned
  let allProjectData = {
    python: [],
    javascript: [],
    html: []
  };
  
  // read the data
  fs.readdirSync('./projects').forEach((file) => {
    // add them all to python until other types are supported
    allProjectData.python.push(file);
  });
  
  // return it
  res.send(allProjectData);
});

// creates a project
app.post('/api/2.0/projects/create-project', (req, res) => {
  // log api call
  console.log('POST /api/2.0/projects/create-project with ');
  console.log(req.body);
  
  let fileData = req.body;
  let filename = fileData.filename;
  let foldername = filename.split('.');
  foldername = foldername[0];
  let file = fileData.file.split(',');
  file = file[1];
  
  // save the file in the projects folder
  fs.writeFile('./projects/' + filename, file, 'base64', (err) => {
    if (err) {
      console.log(err);
    }
    
    // extract the project files
    let zipFile = new zip('./projects/' + filename);
    zipFile.extractAllTo('./projects/' + foldername, true);
    
    // remove zip file
    fs.unlink('./projects/' + filename, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
  
  // respond to client
  res.send('OK');
});