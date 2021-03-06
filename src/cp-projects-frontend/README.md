# cp-projects-frontend

This is the frontend code for my project system. When integrating my system into the existing Zen stack, this code will likely become part of the existing Zen frontend (cp-zen-frontend) but for purposes of my final year project it is separate.

### Running locally

In order to run the frontend locally for development:

```
  cd src/cp-projects-frontend
  npm install
  npm start
```

This will install the necessary dependencies listed in the **package.json** file and host the frontend pages on port **8080**. They can be viewed by going to the following URL in your browser:

```
  http://localhost:8080/
```

In order for GitHub OAuth to work you will need to pass the following environment variable when running **npm start**:

```
  GITHUB_CLIENT_ID: The client id of your GitHub OAuth app
```

### Running tests

You can run the unit tests and generate a coverage report using the following command:

```
  npm run unit
```

You can run all tests and generate a coverage report using the following command:

```
  npm test
```