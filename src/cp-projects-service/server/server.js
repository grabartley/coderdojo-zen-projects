import pty from 'pty.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import io from 'socket.io';
import http from 'http';
import fs from 'file-system';
import zip from 'adm-zip';
import moment from 'moment';
import idService from './id-service';
import githubService from './github-service';

const app = express();
const server = http.createServer(app);
const port = 3000;
const ioServer = io(server);
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

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
  socket.on('start', function (projectId) {
    // get data for this project id
    let projectData = JSON.parse(fs.readFileSync('./projects/' + projectId + '/project-data.json', 'utf-8'));
    // used to store the name of the runtime script to execute
    let runtimeScript = '';
    
    // set the runtime script to use based on the project type
    switch (projectData.type) {
      case 'python':
        runtimeScript = './scripts/runPythonProject';
        break;
      case 'javascript':
        runtimeScript = './scripts/runJavaScriptProject';
    }
    
    // spawn a process to create the Docker container and run the project
    var term = pty.spawn(runtimeScript, [projectId, projectData.name.replace(/ /g,''), projectData.main], {
      name: 'xterm-color'
    });
    
    // when anything is outputted by the process
    term.on('data', function(data) {
      // emit it to the client to display
      socket.emit('output', data);
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

// returns all user data for a given id (mock of Zen API)
app.get('/api/2.0/profiles/load-user-profile/:userId', (req, res) => {
  // log api call
  console.log('GET /api/2.0/profiles/load-user-profile/:userId with ');
  console.log(req.params);
  
  // get all users from store of mock users
  let allUsers = JSON.parse(fs.readFileSync('./users/users.json'));
  allUsers = allUsers.users;
  
  // find user data for this userId
  let userData = allUsers.find((user) => {
    return user.id === req.params.userId;
  });
  
  // respond with the data
  res.send(userData);
});

// creates a project
app.post('/api/2.0/projects/create-project', async (req, res) => {
  // log api call
  console.log('POST /api/2.0/projects/create-project with ');
  console.log(req.body);
  
  // store project data
  let projectData = req.body;
  let filename = projectData.filename;
  // remove header information from file data
  let file = projectData.file.split(',');
  file = file[1];
  
  // generate a new id for this project
  let id = idService.generateProjectId();
  
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
    userId: projectData.userId,
    dojoId: '',
    githubUserId: projectData.githubUserId,
    deletedAt: '',
  };
  
  // save the project archive in the projects folder
  fs.writeFileSync('./projects/' + filename, file, 'base64');
  
  // extract the project files
  let zipFile = new zip('./projects/' + filename);
  zipFile.extractAllTo('./projects/' + id + '/' + metadata.name.replace(/ /g,''), true);
  
  // remove zip file
  fs.unlink('./projects/' + filename, (err) => {
    if (err) {
      console.log(err);
    }
  });
  
  // store project metadata
  fs.writeFileSync('./projects/' + id + '/project-data.json', JSON.stringify(metadata), 'utf-8');
  
  const response = await githubService.createRepo(metadata, projectData.githubUserId);
  
  // respond to client
  res.send(response);
});

// mock of the Zen login API call for my prototype (disregards password since it's just a mock)
app.post('/api/2.0/users/login', (req, res) => {
  // log api call
  console.log('POST /api/2.0/users/login with ');
  console.log(req.body);
  
  // get all users from store of mock users
  let allUsers = JSON.parse(fs.readFileSync('./users/users.json'));
  allUsers = allUsers.users;
  
  // find the user who is trying to login
  let currentUser = allUsers.find((user) => {
    return user.email === req.body.email;
  });
  
  // respond with what was found
  res.send(currentUser);
});

// completes GitHub integration for user with userId
app.post('/api/2.0/users/:userId/integrations/github', async (req, res) => {
  // log api call
  console.log('POST /api/2.0/users/:userId/integrations/github with ');
  console.log(req.params);
  console.log(req.body);
  
  // get data from POST and set secret
  let githubData = req.body;
  githubData['client_secret'] = githubClientSecret;
  
  // get access token
  let data = await githubService.getAccessToken(githubData);
  data = data.split('&');
  const accessToken = ((data[0]).split('='))[1];
  
  // store access token for this user
  let allUsers = JSON.parse(fs.readFileSync('./users/users.json'));
  allUsers.users.forEach((user) => {
    if (user.id === req.params.userId) {
      user.githubAccessToken = accessToken
    }
  });
  fs.writeFileSync('./users/users.json', JSON.stringify(allUsers), 'utf-8');
  
  // respond
  res.send('Successful integration');
});