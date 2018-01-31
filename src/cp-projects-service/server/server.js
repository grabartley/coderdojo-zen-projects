import pty from 'pty.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import io from 'socket.io';
import http from 'http';
import fs from 'file-system';
import zip from 'adm-zip';
import moment from 'moment';

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

// generate a unique id for a new project of the following form:
// 8-4-4-4-12 where the numbers represent the amount of characters
// each character is in range (a-z0-9)
// format may change in the future
function generateProjectId() {
  let idIsUnique = false;
  let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id;
  
  // while a unique id has not been found
  while (!idIsUnique) {
    let index;
    let numOfCharacters;
    id = '';
    for (let i = 0; i < 4; i++) {
      if (i == 0) {
        numOfCharacters = 8;
      } else {
        numOfCharacters = 4;
      }
      for (let i = 0; i < numOfCharacters; i++) {
        index = Math.floor(Math.random() * possibleCharacters.length);
        id += possibleCharacters[index];
      }
      id += '-';
    }
    for (let i = 0; i < 12; i++) {
      index = Math.floor(Math.random() * possibleCharacters.length);
      id += possibleCharacters[index];
    }
    
    idIsUnique = checkIsIdUnique(id);
  }
  return id;
}

// check if the given id is a unique id (using file system for prototype rather than db)
function checkIsIdUnique(id) {
  let isUnique = true;
  
  fs.readdirSync('./projects').forEach(dir => {
    if (id === dir) {
      isUnique = false;
    }
  });
  
  return isUnique;
}

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

/* API */

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
  
  // for each project that is stored
  fs.readdirSync('./projects').forEach((projectId) => {
    let projectData = JSON.parse(fs.readFileSync('./projects/' + projectId + '/project-data.json', 'utf-8'));
    // store it's information in relation to it's type
    switch (projectData.type) {
      case 'python':
        allProjectData.python.push(projectData);
        break;
      case 'javascript':
        allProjectData.javascript.push(projectData);
        break;
      case 'html':
        allProjectData.html.push(projectData);
    }
  });
  
  // return all project data sorted by type
  res.send(allProjectData);
});

// creates a project
app.post('/api/2.0/projects/create-project', (req, res) => {
  // log api call
  console.log('POST /api/2.0/projects/create-project with ');
  console.log(req.body);
  
  // store project data
  let projectData = req.body;
  let filename = projectData.filename;
  // remove extension from filename to get name for folder
  let foldername = filename.split('.');
  foldername = foldername[0];
  // remove header information from file data
  let file = projectData.file.split(',');
  file = file[1];
  
  // generate a new id for this project
  let id = generateProjectId();
  
  // project data to be saved (empty strings have yet to be implemented)
  let metadata = {
    id: id,
    name: projectData.name,
    type: projectData.type,
    main: projectData.main,
    description: projectData.description,
    github: '',
    createdAt: moment().toISOString(),
    updatedAt: '',
    author: '',
    userId: '',
    deleted: false,
  };
  
  // save the project archive in the projects folder
  fs.writeFileSync('./projects/' + filename, file, 'base64');
  
  // extract the project files
  let zipFile = new zip('./projects/' + filename);
  zipFile.extractAllTo('./projects/' + id + '/' + foldername, true);
  
  // remove zip file
  fs.unlink('./projects/' + filename, (err) => {
    if (err) {
      console.log(err);
    }
  });
  
  // store project metadata
  fs.writeFileSync('./projects/' + id + '/project-data.json', JSON.stringify(metadata), 'utf-8');
  
  // respond to client
  res.send('Project created successfully');
});