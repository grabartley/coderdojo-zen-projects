import uuid from 'uuid/v4';
import dbService from '../../services/db-service';
import githubService from '../../services/github-service';

// registers all the endpoints for users
function registerEndpoints(app) {
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
  
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
    githubData['client_secret'] = GITHUB_CLIENT_SECRET;
    
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
}

module.exports = {
  registerEndpoints: registerEndpoints,
};