import moment from 'moment';
import uuid from 'uuid/v4';
import fs from 'file-system';
import zip from 'adm-zip';
import _ from 'lodash';
import dbService from '../../services/db-service';
import fileSystemService from '../../services/file-system-service';
import githubService from '../../services/github-service';

// registers all the endpoints for projects
function registerEndpoints(app) {
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

  // gets the project statistics for a given project id
  app.get('/api/2.0/projects/project-statistics/:projectId', async (req, res) => {
    // log api call
    console.log('GET /api/2.0/projects/project-statistics/:projectId with ');
    console.log(req.params);
    
    // get the statistics for this project id
    const projectStatistics = (await dbService.query(`SELECT * FROM project_statistics WHERE project_id='${req.params.projectId}';`)).rows[0];
    
    // respond with the statistics
    res.send(projectStatistics);
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
    
    // ensure resourceUrl is not malformed
    if (!(projectData.resourceUrl.startsWith('http://') || projectData.resourceUrl.startsWith('https://'))) {
      projectData.resourceUrl = `http://${projectData.resourceUrl}`;
    }
    
    // project data to be saved to database
    const metadata = {
      id: id,
      name: projectData.name,
      type: projectData.type,
      entrypoint: projectData.entrypoint,
      description: projectData.description,
      githubUrl: githubUrl,
      resourceUrl: projectData.resourceUrl,
      createdAt: moment().toISOString(),
      author: author,
      userId: projectData.userId,
      githubIntegrationId: githubIntegrationId,
    };
    
    // add project to the database
    await dbService.insertInto('projects', ['project_id', 'name', 'type', 'entrypoint', 'description', 'github_url', 'resource_url', 'created_at', 'author', 'user_id', 'github_integration_id'], [metadata.id, metadata.name, metadata.type, metadata.entrypoint, metadata.description, metadata.githubUrl, metadata.resourceUrl, metadata.createdAt, metadata.author, metadata.userId, metadata.githubIntegrationId]);
    
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
      
      // ensure resource_url is not malformed
      if (!(queryValues[2].startsWith('http://') || queryValues[2].startsWith('https://'))) {
        queryValues[2] = `http://${queryValues[2]}`;
      }
      
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

  // increments the number of plays a project has by 1
  app.post('/api/2.0/projects/increment-project-plays', async (req, res) => {
    // log api call
    console.log('POST /api/2.0/projects/increment-project-plays with ');
    console.log(req.body);
    
    // get and update plays for this project id
    const currentPlays = (await dbService.query(`SELECT plays FROM project_statistics WHERE project_id='${req.body.projectId}'`)).rows[0].plays;
    const newPlays = parseInt(currentPlays) + 1;
    await dbService.query(`UPDATE project_statistics SET plays=${newPlays} WHERE project_id='${req.body.projectId}'`);
    
    // respond
    res.send('plays successfully updated');
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
}

module.exports = {
  registerEndpoints: registerEndpoints,
};