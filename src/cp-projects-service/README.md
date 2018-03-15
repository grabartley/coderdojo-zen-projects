# cp-projects-service

This is the projects microservice for the CoderDojo Zen platform. This microservice is expected to handle:


  * Runtimes of projects of the following types:
    * Python
    * JavaScript (using NodeJS)
    * HTML/CSS/JavaScript (using GitHub)
  * Version control for projects using GitHub
  * Creation/Update/Deletion of projects
  * Project statistic tracking
  
  
Once this microservice satisfies it's requirements, I will integrate it into the existing Zen stack to work alongside the other microservices.

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