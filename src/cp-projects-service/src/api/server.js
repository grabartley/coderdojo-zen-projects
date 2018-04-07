import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import migrations from '../db-migrations';
import projectEndpoints from './projects/endpoints';
import userEndpoints from './users/endpoints';
import dojoEndpoints from './dojos/endpoints';
import webSocketService from '../services/web-socket-service';

// run database migrations
migrations.migrate();

// set up express server
const APP = express();
const SERVER = http.createServer(APP);
const PORT = 3000;

// used to parse POST data with max size 100MB
APP.use(bodyParser.urlencoded({
  limit: '100mb',
  extended: true
}));
APP.use(bodyParser.json({
  limit: '100mb'
}));

// used for Cross-Origin Resource Sharing (CORS)
APP.use(cors());

// listen on the given port
SERVER.listen(PORT, () => {
  console.log(`\nServer listening on port ${PORT}!`);
});

// set up API endpoints
projectEndpoints.registerEndpoints(APP);
userEndpoints.registerEndpoints(APP);
dojoEndpoints.registerEndpoints(APP);

// register web socket event handlers and emitters
webSocketService.setupSockets(SERVER);