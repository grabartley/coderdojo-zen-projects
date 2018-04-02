import dbService from '../../services/db-service';

// registers all the endpoints for dojos
function registerEndpoints(app) {
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
}

module.exports = {
  registerEndpoints: registerEndpoints,
};