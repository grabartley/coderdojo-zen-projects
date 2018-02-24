const pty = require('node-pty');
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import io from 'socket.io';
import http from 'http';
import moment from 'moment';
import uuid from 'uuid/v4';
import migrations from '../db-migrations';
import dbService from '../services/db-service';
import githubService from '../services/github-service';

// run database migrations
migrations.migrate();

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
  console.log('\nServer listening on port ' + port + '!');
});

// when a client connects
ioServer.on('connection', (socket) => {
  // when a start event is emited by the frontend
  socket.on('start', async (projectId) => {
    // get data for this project id
    const projectResponse = await dbService.query('SELECT * FROM projects WHERE project_id=\'' + projectId + '\';');
    const projectData = projectResponse.rows[0];
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
    const term = pty.spawn(runtimeScript, [projectId, projectData.github, projectData.entrypoint], {
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
  });
});

/* API */

// gets the project data for a given project id
app.get('/api/2.0/projects/project/:projectId', async (req, res) => {
  // log api call
  console.log('GET /api/2.0/projects/project/:projectId with ');
  console.log(req.params);
  
  // get the data for this project id
  const projectResponse = await dbService.query('SELECT * FROM projects WHERE project_id=\'' + req.params.projectId + '\';');
  const projectData = projectResponse.rows[0];
  
  // respond with the data
  res.send(projectData);
});

// returns all project data (tmp)
app.get('/api/2.0/projects/all-project-data', async (req, res) => {
  // log api call
  console.log('GET /api/2.0/projects/all-project-data with ');
  console.log(req.body);
  
  // data structure to be returned
  let allProjectData = {
    python: [],
    javascript: [],
    html: []
  };
  
  // get project data from the database
  const projectsResponse = await dbService.query('SELECT * FROM projects;');
  const projectData = projectsResponse.rows;
  
  // for each project found, add them to the data structure
  projectData.forEach((project) => {
    switch (project.type) {
      case 'python':
        allProjectData.python.push(project);
        break;
      case 'javascript':
        allProjectData.javascript.push(project);
        break;
      case 'html':
        allProjectData.html.push(project);
    }
  });
  
  // return all project data sorted by type
  res.send(allProjectData);
});

// returns all user data for a given id (mock of Zen API)
app.get('/api/2.0/profiles/load-user-profile/:userId', async (req, res) => {
  // log api call
  console.log('GET /api/2.0/profiles/load-user-profile/:userId with ');
  console.log(req.params);
  
  // get the data for the given user id
  const userResponse = await dbService.query('SELECT * FROM users WHERE id=\'' + req.params.userId + '\';');
  const userData = userResponse.rows[0];
  
  // respond with the data
  res.send(userData);
});

// get Dojo data by id (mock of Zen API)
app.get('/api/2.0/dojos/:dojoId', async (req, res) => {
  // log api call
  console.log('GET /api/2.0/dojos/:dojoId with ');
  console.log(req.params);
  
  // get the dojos for the given user from the database
  let dojo = await dbService.query('SELECT * from dojos WHERE id=\'' + req.params.dojoId + '\'');
  
  // respond
  res.send(dojo.rows[0]);
});

// get current logged in user's joined Dojos (mock of Zen API)
app.get('/api/2.0/dojos/dojos-for-user/:userId', async (req, res) => {
  // log api call
  console.log('GET /api/2.0/dojos/dojos-for-user/:userId with ');
  console.log(req.params);
  
  // get the dojo ids for the given user from the database
  let dojoIdsForUser = await dbService.query('SELECT dojos from users WHERE id=\'' + req.params.userId + '\'');
  dojoIdsForUser = dojoIdsForUser.rows[0].dojos;
  let dojosForUser = [];
  
  // for each dojo id, get the dojo data
  for (let i = 0; i < dojoIdsForUser.length; i++) {
    let dojo = await dbService.query('SELECT * from dojos WHERE id=\'' + dojoIdsForUser[i] + '\'');
    dojosForUser.push(dojo.rows[0]);
  }
  
  // respond
  res.send(dojosForUser);
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
  let id = uuid();
  
  // get the author's name to store in the db
  const userResponse = await dbService.query('SELECT name FROM users WHERE id=\'' + projectData.userId + '\';');
  const author = userResponse.rows[0].name;
  
  // get the github integration id for this project to reference access token
  const githubIntegrationResponse = await dbService.query('SELECT github_integration_id FROM github_integrations WHERE dojo_id=\'' + projectData.dojoId + '\';');
  const githubIntegrationId = githubIntegrationResponse.rows[0].github_integration_id;
  
  // repository data to be used by GitHub
  const repoData = {
    id: id,
    description: projectData.description,
    userId: projectData.userId,
  };
  
  // creates the project repository on GitHub
  const repoCreationResponse = await githubService.createRepo(repoData);
  const githubUrl = repoCreationResponse.data.html_url;
  const owner = repoCreationResponse.data.owner.login;
  
  // commit data to be used by GitHub
  const commitData = {
    owner: owner,
    repo: id,
    path: filename,
    message: 'Initial commit',
    content: file,
    branch: 'master',
    userId: projectData.userId
  };
  
  // add project zip file to the GitHub repository
  const commitResponse = await githubService.commitFileToRepo(commitData);
  
  // project data to be saved to database
  const metadata = {
    id: id,
    name: projectData.name,
    type: projectData.type,
    entrypoint: projectData.entrypoint,
    description: projectData.description,
    github: githubUrl,
    createdAt: moment().toISOString(),
    author: author,
    userId: projectData.userId,
    githubIntegrationId: githubIntegrationId,
  };
  
  // add project to the database
  await dbService.insertInto('projects', ['project_id', 'name', 'type', 'entrypoint', 'description', 'github', 'created_at', 'author', 'user_id', 'github_integration_id'], [metadata.id, metadata.name, metadata.type, metadata.entrypoint, metadata.description, metadata.github, metadata.createdAt, metadata.author, metadata.userId, metadata.githubIntegrationId]);
  
  // respond to client
  res.send('successful project creation');
});

// deletes the project with the given id
app.post('/api/2.0/projects/delete-project', async (req, res) => {
  // log api call
  console.log('POST /api/2.0/projects/delete-project with ');
  console.log(req.body);
  
  // set deleted_at for this project to the current time (soft delete)
  dbService.query('UPDATE projects SET deleted_at = \'' + moment().toISOString() + '\' WHERE project_id = \'' + req.body.projectId + '\';');
  
  // respond
  res.send('successful project deletion');
});

// mock of the Zen login API call for my prototype (disregards password since it's just a mock)
app.post('/api/2.0/users/login', async (req, res) => {
  // log api call
  console.log('POST /api/2.0/users/login with ');
  console.log(req.body);
  
  // get the data for the given user id
  const userResponse = await dbService.query('SELECT * FROM users WHERE email=\'' + req.body.email + '\';');
  const userData = userResponse.rows[0];
  
  // respond with what was found
  res.send(userData);
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
  
  // get the dojo ids for the given user from the database
  let dojoIdsForUser = await dbService.query('SELECT dojos from users WHERE id=\'' + req.params.userId + '\'');
  dojoIdsForUser = dojoIdsForUser.rows[0].dojos;
  
  // store the integration data in the database for each dojo
  for (let i = 0; i < dojoIdsForUser.length; i++) {
    let githubIntegrationId = uuid();
    dbService.insertInto('github_integrations', ['github_integration_id', 'user_id', 'dojo_id', 'github_access_token'], [githubIntegrationId, req.params.userId, dojoIdsForUser[i], accessToken]);
  }
  
  // respond
  res.send('Successful integration');
});