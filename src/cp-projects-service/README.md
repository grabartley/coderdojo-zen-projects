# cp-projects-service

This is the projects microservice which forms the backend of my project. It handles:


  * Runtimes of projects of the following types:
    * Python 3
    * NodeJS
    * Java
  * Implementation of API endpoints
  * Version control for projects using GitHub
  * Creation/Update/Deletion of projects
  * Project statistics tracking
  

This microservice is designed to fit into the existing Zen stack to work alongside the other microservices once integration takes place.

### Running the microservice

In order to run this microservice on it's own you will need to clone this repository and then run the following:

```
  cd src/cp-projects-service
  npm install
  npm start
```

This will install the necessary dependencies listed in the **package.json** file and run the **server.js** file to start the microservice on port **3000**.

In order for the database and GitHub OAuth to work you will need to pass the following environment variables when running **npm start**:

```
  PGUSER: A username of your local PostgreSQL database
  PGPASSWORD: The password associated with the above username
  PGDATABASE: The name of your local PostgreSQL database
  PGPORT: The port you local PostgreSQL database is running on
  GITHUB_CLIENT_SECRET: The client secret of your GitHub OAuth app
```

### Loading test data

Test data for the database can be loaded using the **npm run testdata** command which will require the database environment variables:

```
  PGUSER: A username of your local PostgreSQL database
  PGPASSWORD: The password associated with the above username
  PGDATABASE: The name of your local PostgreSQL database
  PGPORT: The port you local PostgreSQL database is running on
```

Note that test data for projects expects certain repositories to exist under the grahambartley account on GitHub which is used solely for the purpose of hosting test projects. It also expects the migrations to have been run on your local database which are run when the microservice starts.

### Running tests

Unit tests can be run using the following command:

```
  npm run unit
```

In order to run integration tests you will need to pass the following environment variables to **npm run integration**:

```
  NODE_ENV: Pass the value 'test' when running tests
  PGUSER: A username of your local PostgreSQL database
  PGPASSWORD: The password associated with the above username
  PGDATABASE: The name of your local PostgreSQL database
  PGPORT: The port you local PostgreSQL database is running on
```

Database environment variables are needed here because the integration tests interact with your local database when running. Note that integration tests reset your local database using the test data each time they are run in order to ensure the tests remain independent of each other.

You can also run unit and integration tests together using the following command which will generate a code coverage report and requires the same environment variables as running the integration tests on their own:

```
  npm test
```