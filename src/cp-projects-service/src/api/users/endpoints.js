import dbService from '../../services/db-service';

// registers all the endpoints for users
function registerEndpoints(app) {
  // returns all user data for a given id (mock of Zen API)
  app.get('/api/2.0/profiles/load-user-profile/:userId', async (req, res) => {
    // log api call
    console.log('GET /api/2.0/profiles/load-user-profile/:userId with ');
    console.log(req.params);
    
    // get the data for the given user id
    const userData = (await dbService.query({
      text: 'SELECT * FROM users WHERE id=$1;',
      values: [req.params.userId],
    })).rows[0];
    
    // respond with the data
    res.send(userData);
  });
  
  // checks if the user with the given id is a champion of the dojo with the given id
  app.get('/api/2.0/users/is-champion/:userId/:dojoId', async (req, res) => {
    // log api call
    console.log('GET /api/2.0/users/is-champion/:userId/:dojoId with ');
    console.log(req.params);
    
    // check if the user is a champion of the dojo
    const dojoChampions = (await dbService.query({
      text: 'SELECT champion_ids FROM dojos WHERE id=$1;',
      values: [req.params.dojoId],
    })).rows[0].champion_ids;
    
    // respond with a boolean
    res.send(dojoChampions.includes(req.params.userId));
  });

  // mock of the Zen login API call for my prototype (disregards password since it's just a mock)
  app.post('/api/2.0/users/login', async (req, res) => {
    // log api call
    console.log('POST /api/2.0/users/login with ');
    console.log(req.body);
    
    // get the data for the given user id
    const userData = (await dbService.query({
      text: 'SELECT * FROM users WHERE email=$1;',
      values: [req.body.email],
    })).rows[0];
    
    // respond with what was found
    res.send(userData);
  });
}

module.exports = {
  registerEndpoints: registerEndpoints,
};