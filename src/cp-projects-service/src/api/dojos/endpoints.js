import uuid from 'uuid/v4';
import dbService from '../../services/db-service';
import githubService from '../../services/github-service';

// registers all the endpoints for dojos
function registerEndpoints(app) {
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

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
  
  // get given users joined Dojos (mock of Zen API)
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
  
  // get given users joined Dojos which have GitHub integrated
  app.get('/api/2.0/dojos/dojos-for-user-with-github/:userId', async (req, res) => {
    // log api call
    console.log('GET /api/2.0/dojos/dojos-for-user-with-github/:userId with ');
    console.log(req.params);
    
    // get the dojo ids for the given user from the database
    let dojoIdsForUser = await dbService.query(`SELECT dojos from users WHERE id='${req.params.userId}';`);
    dojoIdsForUser = dojoIdsForUser.rows[0].dojos;
    let dojosForUser = [];
    
    // for each dojo id, get the dojo data if GitHub is integrated
    for (let i = 0; i < dojoIdsForUser.length; i++) {
      const githubIntegrationIdResponse = (await dbService.query(`SELECT github_integration_id FROM github_integrations WHERE dojo_id='${dojoIdsForUser[i]}'`)).rows[0];
      if (!!githubIntegrationIdResponse) {
        const dojo = await dbService.query(`SELECT * from dojos WHERE id='${dojoIdsForUser[i]}';`);
        dojosForUser.push(dojo.rows[0]);
      }
    }
    
    // respond
    res.send(dojosForUser);
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
  
  // check if Dojo has GitHub integration
  app.get('/api/2.0/dojos/is-github-integrated/:dojoId', async (req, res) => {
    // log api call
    console.log('GET /api/2.0/dojos/is-github-integrated/:dojoId with ');
    console.log(req.params);
    
    // check if github integration exists for this dojo
    const githubIntegrationIdResponse = (await dbService.query(`SELECT github_integration_id FROM github_integrations WHERE dojo_id='${req.params.dojoId}'`)).rows[0];
    
    // respond with boolean
    res.send(!!githubIntegrationIdResponse);
  });
  
  // completes GitHub integration for dojo with dojoId and user with userId
  app.post('/api/2.0/dojos/:dojoId/:userId/integrations/github', async (req, res) => {
    // log api call
    console.log('POST /api/2.0/dojos/:dojoId/:userId/integrations/github with ');
    console.log(req.params);
    console.log(req.body);
    
    // get data from body and params and set secret
    let githubData = req.body;
    githubData['client_secret'] = GITHUB_CLIENT_SECRET;
    const dojoId = req.params.dojoId;
    const userId = req.params.userId;
    
    // get access token
    let data = await githubService.getAccessToken(githubData);
    data = data.split('&');
    const accessToken = ((data[0]).split('='))[1];
    
    // store as new github integration
    const githubIntegrationId = uuid();
    await dbService.insertInto('github_integrations', ['github_integration_id', 'user_id', 'dojo_id', 'github_access_token'], [githubIntegrationId, userId, dojoId, accessToken]);
    
    // respond
    res.send('Successful integration');
  });
  
  // removes GitHub integration for dojo with dojoId and deletes all associated projects
  app.post('/api/2.0/dojos/:dojoId/remove-github-integration', async (req, res) => {
    // log api call
    console.log('POST /api/2.0/dojos/:dojoId/remove-github-integration with ');
    console.log(req.params);
    
    // get data from params
    const dojoId = req.params.dojoId;
    
    // get github integration id and associated project ids
    const githubIntegrationId = (await dbService.query(`SELECT github_integration_id FROM github_integrations WHERE dojo_id='${dojoId}'`)).rows[0].github_integration_id;
    const projectIdResponses = (await dbService.query(`SELECT project_id FROM projects WHERE github_integration_id='${githubIntegrationId}'`)).rows;
    
    // remove associated projects and their statistics
    for (let i = 0; i < projectIdResponses.length; i++) {
      const projectId = projectIdResponses[i].project_id;
      await dbService.query(`DELETE FROM project_statistics WHERE project_id='${projectId}'`);
      await dbService.query(`DELETE FROM projects WHERE project_id='${projectId}'`);
    }
    
    // remove github integration
    await dbService.query(`DELETE FROM github_integrations WHERE github_integration_id='${githubIntegrationId}'`);
    
    // respond
    res.send('Integration removed');
  });
}

module.exports = {
  registerEndpoints: registerEndpoints,
};