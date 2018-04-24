import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import migrations from '../db-migrations';
import projectEndpoints from './projects/endpoints';
import userEndpoints from './users/endpoints';
import dojoEndpoints from './dojos/endpoints';
import webSocketService from '../services/web-socket-service';

// port for the server to listen on
const PORT = 3000;

function setUpServer() {
  // set up express server
  const app = express();
  const server = http.createServer(app);

  // used to parse POST data with max size 100MB
  app.use(bodyParser.urlencoded({
    limit: '100mb',
    extended: true
  }));
  app.use(bodyParser.json({
    limit: '100mb'
  }));

  // used for Cross-Origin Resource Sharing (CORS)
  app.use(cors());

  // set up API endpoints
  projectEndpoints.registerEndpoints(app);
  userEndpoints.registerEndpoints(app);
  dojoEndpoints.registerEndpoints(app);

  // register web socket event handlers and emitters
  webSocketService.setupSockets(server);
  
  // return the server
  return server;
}

function startServer(server) {
  // listen on the given port
  server.listen(PORT, () => {
    console.log(`\nServer listening on port ${PORT}!`);
  });
}

function stopServer(server) {
  // stop the server from listening
  server.close(() => {
    console.log(`\nServer has closed!`);
  });
}

// run database migrations
migrations.migrate();

// set up and start the server if not running tests
if (process.env.NODE_ENV != 'test') {
  const server = setUpServer();
  startServer(server);
}

module.exports = {
  setUpServer,
  startServer,
  stopServer,
};