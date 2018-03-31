const pty = require('node-pty');
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import io from 'socket.io';
import http from 'http';
import moment from 'moment';
import uuid from 'uuid/v4';
import fs from 'file-system';
import zip from 'adm-zip';
import _ from 'lodash';
import migrations from '../db-migrations';
import dbService from '../services/db-service';
import fileSystemService from '../services/file-system-service';
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
  console.log(`\nServer listening on port ${port}!`);
});

// when a client connects
ioServer.on('connection', (socket) => {
  // when a start event is emited by the frontend
  socket.on('start', async (projectId) => {
    // get data for this project id
    const projectResponse = await dbService.query(`SELECT * FROM projects WHERE project_id='${projectId}';`);
    const projectData = projectResponse.rows[0];
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

/* API */

// gets the project data for a given project id
app.get('/api/2.0/projects/project/:projectId', async (req, res) => {
  // log api call
  console.log('GET /api/2.0/projects/project/:projectId with ');
  console.log(req.params);
  
  // get the data for this project id
  const projectResponse = await dbService.query(`SELECT * FROM projects WHERE project_id='${req.params.projectId}';`);
  const projectData = projectResponse.rows[0];
  
  // respond with the data
  res.send(projectData);
});

// returns project data based on query information
app.get('/api/2.0/projects/project-data', async (req, res) => {
  // log api call
  console.log('GET /api/2.0/projects/project-data with ');
  console.log(req.query);
  
  let projectData;
  
  // extract query information
  const deleted = req.query.deleted;
  const sortedBy = req.query.sortedBy;
  const sortOrder = req.query.sortOrder;
  const limit = req.query.limit;
  
  // if we want to sort the data
  if (sortedBy !== 'undefined') {
    switch (sortedBy) {
      case 'plays':
        projectData = (await dbService.query(`SELECT * FROM projects INNER JOIN project_statistics ON projects.project_id = project_statistics.project_id ORDER BY plays ${sortOrder};`)).rows;
        break;
      case 'updated_at':
        projectData = (await dbService.query(`SELECT * FROM projects ORDER BY updated_at ${sortOrder};`)).rows;
        // filter out projects with null for updated_at
        projectData = _.filter(projectData, (project) => {
          return project.updated_at;
        });
        break;
      case 'created_at':
        projectData = (await dbService.query(`SELECT * FROM projects ORDER BY created_at ${sortOrder};`)).rows;
    }
  } else {
    // if not sorted, get all projects
    projectData = (await dbService.query('SELECT * FROM projects;')).rows;
  }
  
  // if we don't want to return projects which have been deleted, filter them out
  if (deleted !== 'true') {
    projectData = _.filter(projectData, (project) => {
      return !project.deleted_at;
    });
  }
  
  // if a limit is specified, use it
  if (limit !== 'undefined') {
    projectData = projectData.slice(0, limit);
  }
  
  // return the project data
  res.send(projectData);
});

// returns all user data for a given id (mock of Zen API)
app.get('/api/2.0/profiles/load-user-profile/:userId', async (req, res) => {
  // log api call
  console.log('GET /api/2.0/profiles/load-user-profile/:userId with ');
  console.log(req.params);
  
  // get the data for the given user id
  const userResponse = await dbService.query(`SELECT * FROM users WHERE id='${req.params.userId}';`);
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
  const dojo = await dbService.query(`SELECT * from dojos WHERE id='${req.params.dojoId}';`);
  
  // respond
  res.send(dojo.rows[0]);
});

// get Dojo by GitHub integration id
app.get('/api/2.0/dojos/dojo-by-github-integration/:githubId', async (req, res) => {
  // log api call
  console.log('GET /api/2.0/dojos/dojo-by-github-integration/:githubId with ');
  console.log(req.params);
  
  // get the dojo data from the database
  let dojoId = await dbService.query(`SELECT dojo_id from github_integrations WHERE github_integration_id='${req.params.githubId}';`);
  dojoId = dojoId.rows[0].dojo_id;
  let dojo = await dbService.query(`SELECT * from dojos WHERE id='${dojoId}';`);
  
  // respond
  res.send(dojo.rows[0]);
});

// get current logged in user's joined Dojos (mock of Zen API)
app.get('/api/2.0/dojos/dojos-for-user/:userId', async (req, res) => {
  // log api call
  console.log('GET /api/2.0/dojos/dojos-for-user/:userId with ');
  console.log(req.params);
  
  // get the dojo ids for the given user from the database
  let dojoIdsForUser = await dbService.query(`SELECT dojos from users WHERE id='${req.params.userId}';`);
  dojoIdsForUser = dojoIdsForUser.rows[0].dojos;
  let dojosForUser = [];
  
  // for each dojo id, get the dojo data
  for (let i = 0; i < dojoIdsForUser.length; i++) {
    let dojo = await dbService.query(`SELECT * from dojos WHERE id='${dojoIdsForUser[i]}';`);
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
  
  // remove header information from file data
  let file = projectData.file.split(',');
  file = file[1];
  
  // extract project files
  let folderName = 'projectFiles';
  fs.writeFileSync(`./${projectData.filename}`, file, 'base64');
  const projectZip = new zip(`./${projectData.filename}`);
  projectZip.extractAllTo(`./${folderName}`, true);
  
  // get project file paths and data from extracted zip
  let projectFiles = fileSystemService.recursiveListSync(`./${folderName}/`);
  
  // remove zip and created directory
  fs.unlinkSync(`./${projectData.filename}`);
  fs.rmdirSync(`./${folderName}`);
  
  // fix project file paths
  let charsToCut = (`./${folderName}/`).length;
  projectFiles.forEach((file) => {
    file.path = file.path.substring(charsToCut);
  });
  
  // generate a new id for this project and it's statistics entry
  const id = uuid();
  const statisticsId = uuid();
  
  // get the author's name to store in the db
  const userResponse = await dbService.query(`SELECT name FROM users WHERE id='${projectData.userId}';`);
  const author = userResponse.rows[0].name;
  
  // get the github integration id for this project to reference access token
  const githubIntegrationResponse = await dbService.query(`SELECT github_integration_id FROM github_integrations WHERE dojo_id='${projectData.dojoId}';`);
  const githubIntegrationId = githubIntegrationResponse.rows[0].github_integration_id;
  
  // repository data to be used by GitHub
  const repoData = {
    id: id,
    description: projectData.description,
    dojoId: projectData.dojoId,
  };
  
  // create the project repository on GitHub
  const repoCreationResponse = await githubService.createRepo(repoData);
  const githubUrl = repoCreationResponse.data.html_url;
  const owner = repoCreationResponse.data.owner.login;
  
  // set the branch to use based on project type since HTML projects use GitHub pages
  let branch = 'master';
  if (projectData.type === 'html') {
    branch = 'gh-pages'
  }
  
  // commit data to be used by GitHub
  const commitData = {
    repo: id,
    path: 'README.md',
    message: 'Initial commit',
    content: Buffer.from(projectData.description).toString('base64'),
    branch: branch,
    dojoId: projectData.dojoId
  };
  
  // add project zip file to the GitHub repository
  await githubService.commitFileToRepo(commitData);
  
  // create tree data object to pass to GitHub service
  const treeData = {
    repo: id,
    dojoId: projectData.dojoId,
    files: projectFiles,
    branch: branch,
  };
  
  // push tree of files to the repo
  await githubService.pushTreeToRepo(treeData);
  
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
  await dbService.insertInto('projects', ['project_id', 'name', 'type', 'entrypoint', 'description', 'github_url', 'created_at', 'author', 'user_id', 'github_integration_id'], [metadata.id, metadata.name, metadata.type, metadata.entrypoint, metadata.description, metadata.github, metadata.createdAt, metadata.author, metadata.userId, metadata.githubIntegrationId]);
  
  // add statistics entry for project to the database
  await dbService.insertInto('project_statistics', ['project_statistics_id', 'project_id'], [statisticsId, id]);
  
  // respond to client
  res.send('successful project creation');
});

// updates a project with the given projectData
app.post('/api/2.0/projects/update-project', async (req, res) => {
  // log api call
  console.log('POST /api/2.0/projects/update-project with ');
  console.log(req.body);
  
  // get project data
  const projectData = req.body;
  
  // if updating the database
  if (projectData.columns) {
    // construct db query string and values
    let queryString = 'UPDATE projects SET';
    let queryValues = projectData.values;
    
    // for each column to be updated, add it to the query string
    for (let i = 0; i < projectData.columns.length; i++) {
      let columnName = projectData.columns[i];
      queryString += ` ${columnName}=\$${i + 1},`;
    }
    queryString = queryString.substring(0, queryString.length - 1);
    queryString += ` WHERE project_id='${projectData.projectId}';`;
    
    // construct query object
    const query = {
      text: queryString,
      values: queryValues,
    };
    
    // execute query
    await dbService.query(query);
  }
  
  // if updating project files
  if (projectData.file) {
    // remove header information from file data
    let file = projectData.file.split(',');
    file = file[1];
    
    // extract project files
    let folderName = 'projectFiles';
    fs.writeFileSync(`./${projectData.filename}`, file, 'base64');
    const projectZip = new zip(`./${projectData.filename}`);
    projectZip.extractAllTo(`./${folderName}`, true);
    
    // get project file paths and data from extracted zip
    let projectFiles = fileSystemService.recursiveListSync(`./${folderName}/`);
    
    // remove zip and created directory
    fs.unlinkSync(`./${projectData.filename}`);
    fs.rmdirSync(`./${folderName}`);
    
    // fix project file paths
    let charsToCut = (`./${folderName}/`).length;
    projectFiles.forEach((file) => {
      file.path = file.path.substring(charsToCut);
    });
    
    // get the dojoId for this project from the db
    const dojoId = (await dbService.query(`SELECT dojo_id FROM github_integrations WHERE github_integration_id='${projectData.githubIntegrationId}';`)).rows[0].dojo_id;
    
    // set the branch to use based on project type since HTML projects use GitHub pages
    let branch = 'master';
    if (projectData.type === 'html') {
      branch = 'gh-pages'
    }
    
    // create tree data object to pass to GitHub service
    const treeData = {
      repo: projectData.projectId,
      dojoId: dojoId,
      files: projectFiles,
      branch: branch,
    };
    
    // push tree of files to the repo
    await githubService.pushTreeToRepo(treeData);
  }
  
  // set updated time
  await dbService.query(`UPDATE projects SET updated_at='${moment().toISOString()}' WHERE project_id='${projectData.projectId}';`);
  
  // respond
  res.send('successful project update');
});

// deletes the project with the given id
app.post('/api/2.0/projects/delete-project', async (req, res) => {
  // log api call
  console.log('POST /api/2.0/projects/delete-project with ');
  console.log(req.body);
  
  // set deleted_at for this project to the current time (soft delete)
  await dbService.query(`UPDATE projects SET deleted_at='${moment().toISOString()}' WHERE project_id='${req.body.projectId}';`);
  
  // respond
  res.send('successful project deletion');
});

// mock of the Zen login API call for my prototype (disregards password since it's just a mock)
app.post('/api/2.0/users/login', async (req, res) => {
  // log api call
  console.log('POST /api/2.0/users/login with ');
  console.log(req.body);
  
  // get the data for the given user id
  const userResponse = await dbService.query(`SELECT * FROM users WHERE email='${req.body.email}';`);
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
  let dojoIdsForUser = await dbService.query(`SELECT dojos from users WHERE id='${req.params.userId}';`);
  dojoIdsForUser = dojoIdsForUser.rows[0].dojos;
  
  // store the integration data in the database for each dojo
  for (let i = 0; i < dojoIdsForUser.length; i++) {
    let githubIntegrationId = uuid();
    dbService.insertInto('github_integrations', ['github_integration_id', 'user_id', 'dojo_id', 'github_access_token'], [githubIntegrationId, req.params.userId, dojoIdsForUser[i], accessToken]);
  }
  
  // respond
  res.send('Successful integration');
});