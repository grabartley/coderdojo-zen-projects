# prototype-projects-frontend

This is the frontend code for my prototype system. When integrating my system into the existing Zen stack, this code will likely become part of the existing Zen frontend (cp-zen-frontend) but for purposes of developing a standalone prototype in the meantime it is separate.

### Running locally

In order to run the frontend locally for development:

```
  cd src/prototype-projects-frontend
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