import chai from 'chai';
import request from 'supertest';
import server from '../../../../../src/api/server';
import testData from '../../../../../db/test-data';
const expect = chai.expect;

describe('Projects API', () => {
  let serverInstance;
  before(() => {
    serverInstance = server.setUpServer();
    server.startServer(serverInstance);
  });
  beforeEach(async () => {
    await testData.loadTestData();
  });
  after(async () => {
    await testData.loadTestData();
    await server.stopServer(serverInstance);
  });
  describe('GET /api/2.0/projects/project/:projectId', () => {
    it('should get the project data for a given project id', (done) => {
      const projectIdMock = '39cc1218-1cc0-46af-9608-eb841d252afc';
      request(serverInstance)
        .get(`/api/2.0/projects/project/${projectIdMock}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.deep.equal({
              project_id: '39cc1218-1cc0-46af-9608-eb841d252afc',
              name: 'Current Date and Time',
              type: 'javascript',
              entrypoint: 'index.js',
              description: 'Displays the current date and time in ISO format using momentjs.',
              github_url: 'https://github.com/grahambartley/39cc1218-1cc0-46af-9608-eb841d252afc',
              resource_url: null,
              created_at: '2018-03-31T18:33:52.453Z',
              updated_at: '2018-04-10T10:12:00.560Z',
              author: 'Youth One',
              user_id: '12a4df02-6cbd-40b0-b2df-2531b136afec',
              github_integration_id: 'b301386a-75cc-438d-873b-7fb8f937a9a0',
              deleted_at: null
          });
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
    it('should not get project data for an invalid project id', (done) => {
      const projectIdMock = '1234-5678';
      request(serverInstance)
        .get(`/api/2.0/projects/project/${projectIdMock}`)
        .expect(404)
        .expect((res) => {
          expect(res.error.text).to.equal('Not found');
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });
  describe('GET /api/2.0/projects/project-statistics/:projectId', () => {
    it('should get the project statistics data for a given project id', (done) => {
      const projectIdMock = '39cc1218-1cc0-46af-9608-eb841d252afc';
      request(serverInstance)
        .get(`/api/2.0/projects/project-statistics/${projectIdMock}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.deep.equal({
              project_statistics_id: '07324bdb-80c4-4e58-b209-e3fb45850aae',
              project_id: '39cc1218-1cc0-46af-9608-eb841d252afc',
              plays: '1'
          });
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
    it('should not get project statistics data for an invalid project id', (done) => {
      const projectIdMock = '1234-5678';
      request(serverInstance)
        .get(`/api/2.0/projects/project-statistics/${projectIdMock}`)
        .expect(404)
        .expect((res) => {
          expect(res.error.text).to.equal('Not found');
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });
  describe('GET /api/2.0/projects/project-data', () => {
    it('should get all project data', (done) => {
      request(serverInstance)
        .get(`/api/2.0/projects/project-data`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.deep.equal([
              {
                  "project_id": "f7f877f1-fea9-4451-9945-1d98fac2dcf4",
                  "name": "Chess",
                  "type": "python",
                  "entrypoint": "Chess.py",
                  "description": "Command line chess written in Python!",
                  "github_url": "https://github.com/grahambartley/f7f877f1-fea9-4451-9945-1d98fac2dcf4",
                  "resource_url": null,
                  "created_at": "2018-03-31T18:20:59.952Z",
                  "updated_at": null,
                  "author": "Youth One",
                  "user_id": "12a4df02-6cbd-40b0-b2df-2531b136afec",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "39cc1218-1cc0-46af-9608-eb841d252afc",
                  "name": "Current Date and Time",
                  "type": "javascript",
                  "entrypoint": "index.js",
                  "description": "Displays the current date and time in ISO format using momentjs.",
                  "github_url": "https://github.com/grahambartley/39cc1218-1cc0-46af-9608-eb841d252afc",
                  "resource_url": null,
                  "created_at": "2018-03-31T18:33:52.453Z",
                  "updated_at": "2018-04-10T10:12:00.560Z",
                  "author": "Youth One",
                  "user_id": "12a4df02-6cbd-40b0-b2df-2531b136afec",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "ca681aea-ce69-4d89-bbc8-11db6f8e1ac3",
                  "name": "My First Website",
                  "type": "html",
                  "entrypoint": "index.html",
                  "description": "The first website I created as part of my sessions with Awesome Dojo!",
                  "github_url": "https://github.com/grahambartley/ca681aea-ce69-4d89-bbc8-11db6f8e1ac3",
                  "resource_url": null,
                  "created_at": "2018-03-31T18:35:28.402Z",
                  "updated_at": "2018-04-14T22:20:56.232Z",
                  "author": "Youth One",
                  "user_id": "12a4df02-6cbd-40b0-b2df-2531b136afec",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "4fc3eb1c-abf6-4df2-8dc0-e7b3b9b3977a",
                  "name": "Bank",
                  "type": "python",
                  "entrypoint": "Withdraw.py",
                  "description": "A simple bank account program used to demonstrate OOP in Python.",
                  "github_url": "https://github.com/grahambartley/4fc3eb1c-abf6-4df2-8dc0-e7b3b9b3977a",
                  "resource_url": null,
                  "created_at": "2018-03-31T19:08:45.409Z",
                  "updated_at": "2018-04-01T14:10:43.820Z",
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "d508227e-263a-4af8-ac9d-249a4a7dbe3f",
                  "name": "Django Project",
                  "type": "python",
                  "entrypoint": "test.py",
                  "description": "Prints out the current version of Django being used.",
                  "github_url": "https://github.com/grahambartley/d508227e-263a-4af8-ac9d-249a4a7dbe3f",
                  "resource_url": null,
                  "created_at": "2018-03-31T19:09:55.570Z",
                  "updated_at": null,
                  "author": "Youth One",
                  "user_id": "12a4df02-6cbd-40b0-b2df-2531b136afec",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "80491c66-3e0e-412b-adea-a385773443cc",
                  "name": "Shopping List",
                  "type": "python",
                  "entrypoint": "ShoppingList.py",
                  "description": "A simple shopping list program.",
                  "github_url": "https://github.com/grahambartley/80491c66-3e0e-412b-adea-a385773443cc",
                  "resource_url": null,
                  "created_at": "2018-03-31T19:07:15.403Z",
                  "updated_at": "2018-04-10T07:21:12.440Z",
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "82208249-1b5f-4334-80ff-8d88d8332bc1",
                  "name": "Hello, World!",
                  "type": "javascript",
                  "entrypoint": "hello-world.js",
                  "description": "A simple hello world program written in NodeJS.",
                  "github_url": "https://github.com/grahambartley/82208249-1b5f-4334-80ff-8d88d8332bc1",
                  "resource_url": null,
                  "created_at": "2018-03-31T19:06:08.841Z",
                  "updated_at": null,
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "e93dba14-62c9-4776-bddf-1530fc940168",
                  "name": "My Second Website",
                  "type": "html",
                  "entrypoint": "index.html",
                  "description": "The second website I made with Awesome Dojo!",
                  "github_url": "https://github.com/grahambartley/e93dba14-62c9-4776-bddf-1530fc940168",
                  "resource_url": "http://coderdojo.gitbooks.io/beginner-html-css/content/en/",
                  "created_at": "2018-04-01T19:49:15.515Z",
                  "updated_at": null,
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "16433d6f-ea35-4119-9a1e-8e34222631bd",
                  "name": "Castle Escape",
                  "type": "java",
                  "entrypoint": "Main.java",
                  "description": "Castle Escape is a text-based adventure-puzzle game. The objective of the game is to escape the castle you find yourself in. There are various different rooms to the castle which you can travel through on your adventure. You may find items as you go along which you can collect. These will aid you in your escape! Items can only be used under specific circumstances, so think about when each item may be needed. It can be very useful to draw a map as you journey through the castle as its easy to get lost. Pay close attention to room and item descriptions as they may provide hints on what to do! Also be careful to only provide input when asked for it, otherwise glitches may occur which cause you to lose progress! Other than that, its up to you! Good luck escaping the castle!",
                  "github_url": "https://github.com/grahambartley/16433d6f-ea35-4119-9a1e-8e34222631bd",
                  "resource_url": "https://coderdojo.gitbooks.io/beginner-java/content/en/coin_toss.html",
                  "created_at": "2018-03-31T19:10:48.910Z",
                  "updated_at": "2018-04-20T13:32:10.143Z",
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "d0578aa0-96d9-4736-ad03-fcf568e5dc5b",
                  "name": "Square Numbers",
                  "type": "java",
                  "entrypoint": "SquareNum.java",
                  "description": "Squares given numbers.",
                  "github_url": "https://github.com/grahambartley/d0578aa0-96d9-4736-ad03-fcf568e5dc5b",
                  "resource_url": null,
                  "created_at": "2018-04-13T11:47:45.961Z",
                  "updated_at": null,
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "c0d419d6-1d08-4052-ba27-30fb5acdf48f",
                  "name": "Test 1",
                  "type": "java",
                  "entrypoint": "Main.java",
                  "description": "Test",
                  "github_url": "https://github.com/grahambartley/c0d419d6-1d08-4052-ba27-30fb5acdf48f",
                  "resource_url": "http://www.google.ie",
                  "created_at": "2018-04-01T14:40:08.981Z",
                  "updated_at": null,
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "00876274-42af-465a-b251-0a5ab2b2b5fd",
                  "name": "My Awesome Project",
                  "type": "java",
                  "entrypoint": "SquareNum.java",
                  "description": "I hope this works.",
                  "github_url": "https://github.com/grahambartley/00876274-42af-465a-b251-0a5ab2b2b5fd",
                  "resource_url": null,
                  "created_at": "2018-04-10T11:20:43.888Z",
                  "updated_at": null,
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "db66d80f-0de1-4a89-ab03-4e71a3ecb26d",
                  "name": "Square Numbers",
                  "type": "java",
                  "entrypoint": "SquareNum.java",
                  "description": "Squares numbers given in input until a -1 is given!",
                  "github_url": "https://github.com/grahambartley/db66d80f-0de1-4a89-ab03-4e71a3ecb26d",
                  "resource_url": null,
                  "created_at": "2018-04-11T17:19:44.999Z",
                  "updated_at": null,
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "d9f1e025-d87d-41bb-8c1e-1f25b1890a1a",
                  "name": "Sample Project",
                  "type": "python",
                  "entrypoint": "main.py",
                  "description": "Hello World!",
                  "github_url": "https://github.com/grahambartley/d9f1e025-d87d-41bb-8c1e-1f25b1890a1a",
                  "resource_url": null,
                  "created_at": "2018-04-17T11:59:56.026Z",
                  "updated_at": null,
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              }
          ]);
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
    it('should get sorted project data', (done) => {
      let deletedMock = false;
      let sortedByMock = 'plays';
      let sortOrderMock = 'desc';
      let limitMock = 3;
      request(serverInstance)
        .get(`/api/2.0/projects/project-data?deleted=${deletedMock}&sortedBy=${sortedByMock}&sortOrder=${sortOrderMock}&limit=${limitMock}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.deep.equal([
              {
                  "project_id": "f7f877f1-fea9-4451-9945-1d98fac2dcf4",
                  "name": "Chess",
                  "type": "python",
                  "entrypoint": "Chess.py",
                  "description": "Command line chess written in Python!",
                  "github_url": "https://github.com/grahambartley/f7f877f1-fea9-4451-9945-1d98fac2dcf4",
                  "resource_url": null,
                  "created_at": "2018-03-31T18:20:59.952Z",
                  "updated_at": null,
                  "author": "Youth One",
                  "user_id": "12a4df02-6cbd-40b0-b2df-2531b136afec",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null,
                  "project_statistics_id": "43b5d1dd-4d93-492e-9cf4-f8b40ce00c7f",
                  "plays": "1169"
              },
              {
                  "project_id": "16433d6f-ea35-4119-9a1e-8e34222631bd",
                  "name": "Castle Escape",
                  "type": "java",
                  "entrypoint": "Main.java",
                  "description": "Castle Escape is a text-based adventure-puzzle game. The objective of the game is to escape the castle you find yourself in. There are various different rooms to the castle which you can travel through on your adventure. You may find items as you go along which you can collect. These will aid you in your escape! Items can only be used under specific circumstances, so think about when each item may be needed. It can be very useful to draw a map as you journey through the castle as its easy to get lost. Pay close attention to room and item descriptions as they may provide hints on what to do! Also be careful to only provide input when asked for it, otherwise glitches may occur which cause you to lose progress! Other than that, its up to you! Good luck escaping the castle!",
                  "github_url": "https://github.com/grahambartley/16433d6f-ea35-4119-9a1e-8e34222631bd",
                  "resource_url": "https://coderdojo.gitbooks.io/beginner-java/content/en/coin_toss.html",
                  "created_at": "2018-03-31T19:10:48.910Z",
                  "updated_at": "2018-04-20T13:32:10.143Z",
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null,
                  "project_statistics_id": "8354f62d-7358-4bac-874f-4d499680075b",
                  "plays": "211"
              },
              {
                  "project_id": "db66d80f-0de1-4a89-ab03-4e71a3ecb26d",
                  "name": "Square Numbers",
                  "type": "java",
                  "entrypoint": "SquareNum.java",
                  "description": "Squares numbers given in input until a -1 is given!",
                  "github_url": "https://github.com/grahambartley/db66d80f-0de1-4a89-ab03-4e71a3ecb26d",
                  "resource_url": null,
                  "created_at": "2018-04-11T17:19:44.999Z",
                  "updated_at": null,
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null,
                  "project_statistics_id": "393ee5bf-7bfc-4f98-9e7f-0cd1a6f52720",
                  "plays": "106"
              }
          ]);
        })
        .end((err, res) => {
          if (err) return done(err);
        });
      deletedMock = true;
      sortedByMock = 'updated_at';
      sortOrderMock = 'desc';
      limitMock = 3;
      request(serverInstance)
        .get(`/api/2.0/projects/project-data?deleted=${deletedMock}&sortedBy=${sortedByMock}&sortOrder=${sortOrderMock}&limit=${limitMock}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.deep.equal([
              {
                  "project_id": "16433d6f-ea35-4119-9a1e-8e34222631bd",
                  "name": "Castle Escape",
                  "type": "java",
                  "entrypoint": "Main.java",
                  "description": "Castle Escape is a text-based adventure-puzzle game. The objective of the game is to escape the castle you find yourself in. There are various different rooms to the castle which you can travel through on your adventure. You may find items as you go along which you can collect. These will aid you in your escape! Items can only be used under specific circumstances, so think about when each item may be needed. It can be very useful to draw a map as you journey through the castle as its easy to get lost. Pay close attention to room and item descriptions as they may provide hints on what to do! Also be careful to only provide input when asked for it, otherwise glitches may occur which cause you to lose progress! Other than that, its up to you! Good luck escaping the castle!",
                  "github_url": "https://github.com/grahambartley/16433d6f-ea35-4119-9a1e-8e34222631bd",
                  "resource_url": "https://coderdojo.gitbooks.io/beginner-java/content/en/coin_toss.html",
                  "created_at": "2018-03-31T19:10:48.910Z",
                  "updated_at": "2018-04-20T13:32:10.143Z",
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "ca681aea-ce69-4d89-bbc8-11db6f8e1ac3",
                  "name": "My First Website",
                  "type": "html",
                  "entrypoint": "index.html",
                  "description": "The first website I created as part of my sessions with Awesome Dojo!",
                  "github_url": "https://github.com/grahambartley/ca681aea-ce69-4d89-bbc8-11db6f8e1ac3",
                  "resource_url": null,
                  "created_at": "2018-03-31T18:35:28.402Z",
                  "updated_at": "2018-04-14T22:20:56.232Z",
                  "author": "Youth One",
                  "user_id": "12a4df02-6cbd-40b0-b2df-2531b136afec",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "39cc1218-1cc0-46af-9608-eb841d252afc",
                  "name": "Current Date and Time",
                  "type": "javascript",
                  "entrypoint": "index.js",
                  "description": "Displays the current date and time in ISO format using momentjs.",
                  "github_url": "https://github.com/grahambartley/39cc1218-1cc0-46af-9608-eb841d252afc",
                  "resource_url": null,
                  "created_at": "2018-03-31T18:33:52.453Z",
                  "updated_at": "2018-04-10T10:12:00.560Z",
                  "author": "Youth One",
                  "user_id": "12a4df02-6cbd-40b0-b2df-2531b136afec",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              }
          ]);
        })
        .end((err, res) => {
          if (err) return done(err);
        });
      deletedMock = false;
      sortedByMock = 'created_at';
      sortOrderMock = 'asc';
      limitMock = 3;
      request(serverInstance)
        .get(`/api/2.0/projects/project-data?deleted=${deletedMock}&sortedBy=${sortedByMock}&sortOrder=${sortOrderMock}&limit=${limitMock}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.deep.equal([
              {
                  "project_id": "f7f877f1-fea9-4451-9945-1d98fac2dcf4",
                  "name": "Chess",
                  "type": "python",
                  "entrypoint": "Chess.py",
                  "description": "Command line chess written in Python!",
                  "github_url": "https://github.com/grahambartley/f7f877f1-fea9-4451-9945-1d98fac2dcf4",
                  "resource_url": null,
                  "created_at": "2018-03-31T18:20:59.952Z",
                  "updated_at": null,
                  "author": "Youth One",
                  "user_id": "12a4df02-6cbd-40b0-b2df-2531b136afec",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "39cc1218-1cc0-46af-9608-eb841d252afc",
                  "name": "Current Date and Time",
                  "type": "javascript",
                  "entrypoint": "index.js",
                  "description": "Displays the current date and time in ISO format using momentjs.",
                  "github_url": "https://github.com/grahambartley/39cc1218-1cc0-46af-9608-eb841d252afc",
                  "resource_url": null,
                  "created_at": "2018-03-31T18:33:52.453Z",
                  "updated_at": "2018-04-10T10:12:00.560Z",
                  "author": "Youth One",
                  "user_id": "12a4df02-6cbd-40b0-b2df-2531b136afec",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "ca681aea-ce69-4d89-bbc8-11db6f8e1ac3",
                  "name": "My First Website",
                  "type": "html",
                  "entrypoint": "index.html",
                  "description": "The first website I created as part of my sessions with Awesome Dojo!",
                  "github_url": "https://github.com/grahambartley/ca681aea-ce69-4d89-bbc8-11db6f8e1ac3",
                  "resource_url": null,
                  "created_at": "2018-03-31T18:35:28.402Z",
                  "updated_at": "2018-04-14T22:20:56.232Z",
                  "author": "Youth One",
                  "user_id": "12a4df02-6cbd-40b0-b2df-2531b136afec",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              }
          ]);
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });
  describe('GET /api/2.0/projects/projects-for-dojo/:dojoId', () => {
    it('should get the project data for a given dojo id', (done) => {
      const dojoIdMock = '54b7f667-6c3c-acbd-bb4c-0911a6e7cd5d';
      request(serverInstance)
        .get(`/api/2.0/projects/projects-for-dojo/${dojoIdMock}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.deep.equal([
              {
                  "project_id": "f7f877f1-fea9-4451-9945-1d98fac2dcf4",
                  "name": "Chess",
                  "type": "python",
                  "entrypoint": "Chess.py",
                  "description": "Command line chess written in Python!",
                  "github_url": "https://github.com/grahambartley/f7f877f1-fea9-4451-9945-1d98fac2dcf4",
                  "resource_url": null,
                  "created_at": "2018-03-31T18:20:59.952Z",
                  "updated_at": null,
                  "author": "Youth One",
                  "user_id": "12a4df02-6cbd-40b0-b2df-2531b136afec",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "39cc1218-1cc0-46af-9608-eb841d252afc",
                  "name": "Current Date and Time",
                  "type": "javascript",
                  "entrypoint": "index.js",
                  "description": "Displays the current date and time in ISO format using momentjs.",
                  "github_url": "https://github.com/grahambartley/39cc1218-1cc0-46af-9608-eb841d252afc",
                  "resource_url": null,
                  "created_at": "2018-03-31T18:33:52.453Z",
                  "updated_at": "2018-04-10T10:12:00.560Z",
                  "author": "Youth One",
                  "user_id": "12a4df02-6cbd-40b0-b2df-2531b136afec",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "ca681aea-ce69-4d89-bbc8-11db6f8e1ac3",
                  "name": "My First Website",
                  "type": "html",
                  "entrypoint": "index.html",
                  "description": "The first website I created as part of my sessions with Awesome Dojo!",
                  "github_url": "https://github.com/grahambartley/ca681aea-ce69-4d89-bbc8-11db6f8e1ac3",
                  "resource_url": null,
                  "created_at": "2018-03-31T18:35:28.402Z",
                  "updated_at": "2018-04-14T22:20:56.232Z",
                  "author": "Youth One",
                  "user_id": "12a4df02-6cbd-40b0-b2df-2531b136afec",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "4fc3eb1c-abf6-4df2-8dc0-e7b3b9b3977a",
                  "name": "Bank",
                  "type": "python",
                  "entrypoint": "Withdraw.py",
                  "description": "A simple bank account program used to demonstrate OOP in Python.",
                  "github_url": "https://github.com/grahambartley/4fc3eb1c-abf6-4df2-8dc0-e7b3b9b3977a",
                  "resource_url": null,
                  "created_at": "2018-03-31T19:08:45.409Z",
                  "updated_at": "2018-04-01T14:10:43.820Z",
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "d508227e-263a-4af8-ac9d-249a4a7dbe3f",
                  "name": "Django Project",
                  "type": "python",
                  "entrypoint": "test.py",
                  "description": "Prints out the current version of Django being used.",
                  "github_url": "https://github.com/grahambartley/d508227e-263a-4af8-ac9d-249a4a7dbe3f",
                  "resource_url": null,
                  "created_at": "2018-03-31T19:09:55.570Z",
                  "updated_at": null,
                  "author": "Youth One",
                  "user_id": "12a4df02-6cbd-40b0-b2df-2531b136afec",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "80491c66-3e0e-412b-adea-a385773443cc",
                  "name": "Shopping List",
                  "type": "python",
                  "entrypoint": "ShoppingList.py",
                  "description": "A simple shopping list program.",
                  "github_url": "https://github.com/grahambartley/80491c66-3e0e-412b-adea-a385773443cc",
                  "resource_url": null,
                  "created_at": "2018-03-31T19:07:15.403Z",
                  "updated_at": "2018-04-10T07:21:12.440Z",
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "82208249-1b5f-4334-80ff-8d88d8332bc1",
                  "name": "Hello, World!",
                  "type": "javascript",
                  "entrypoint": "hello-world.js",
                  "description": "A simple hello world program written in NodeJS.",
                  "github_url": "https://github.com/grahambartley/82208249-1b5f-4334-80ff-8d88d8332bc1",
                  "resource_url": null,
                  "created_at": "2018-03-31T19:06:08.841Z",
                  "updated_at": null,
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "e93dba14-62c9-4776-bddf-1530fc940168",
                  "name": "My Second Website",
                  "type": "html",
                  "entrypoint": "index.html",
                  "description": "The second website I made with Awesome Dojo!",
                  "github_url": "https://github.com/grahambartley/e93dba14-62c9-4776-bddf-1530fc940168",
                  "resource_url": "http://coderdojo.gitbooks.io/beginner-html-css/content/en/",
                  "created_at": "2018-04-01T19:49:15.515Z",
                  "updated_at": null,
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "16433d6f-ea35-4119-9a1e-8e34222631bd",
                  "name": "Castle Escape",
                  "type": "java",
                  "entrypoint": "Main.java",
                  "description": "Castle Escape is a text-based adventure-puzzle game. The objective of the game is to escape the castle you find yourself in. There are various different rooms to the castle which you can travel through on your adventure. You may find items as you go along which you can collect. These will aid you in your escape! Items can only be used under specific circumstances, so think about when each item may be needed. It can be very useful to draw a map as you journey through the castle as its easy to get lost. Pay close attention to room and item descriptions as they may provide hints on what to do! Also be careful to only provide input when asked for it, otherwise glitches may occur which cause you to lose progress! Other than that, its up to you! Good luck escaping the castle!",
                  "github_url": "https://github.com/grahambartley/16433d6f-ea35-4119-9a1e-8e34222631bd",
                  "resource_url": "https://coderdojo.gitbooks.io/beginner-java/content/en/coin_toss.html",
                  "created_at": "2018-03-31T19:10:48.910Z",
                  "updated_at": "2018-04-20T13:32:10.143Z",
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "d0578aa0-96d9-4736-ad03-fcf568e5dc5b",
                  "name": "Square Numbers",
                  "type": "java",
                  "entrypoint": "SquareNum.java",
                  "description": "Squares given numbers.",
                  "github_url": "https://github.com/grahambartley/d0578aa0-96d9-4736-ad03-fcf568e5dc5b",
                  "resource_url": null,
                  "created_at": "2018-04-13T11:47:45.961Z",
                  "updated_at": null,
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "c0d419d6-1d08-4052-ba27-30fb5acdf48f",
                  "name": "Test 1",
                  "type": "java",
                  "entrypoint": "Main.java",
                  "description": "Test",
                  "github_url": "https://github.com/grahambartley/c0d419d6-1d08-4052-ba27-30fb5acdf48f",
                  "resource_url": "http://www.google.ie",
                  "created_at": "2018-04-01T14:40:08.981Z",
                  "updated_at": null,
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "00876274-42af-465a-b251-0a5ab2b2b5fd",
                  "name": "My Awesome Project",
                  "type": "java",
                  "entrypoint": "SquareNum.java",
                  "description": "I hope this works.",
                  "github_url": "https://github.com/grahambartley/00876274-42af-465a-b251-0a5ab2b2b5fd",
                  "resource_url": null,
                  "created_at": "2018-04-10T11:20:43.888Z",
                  "updated_at": null,
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "db66d80f-0de1-4a89-ab03-4e71a3ecb26d",
                  "name": "Square Numbers",
                  "type": "java",
                  "entrypoint": "SquareNum.java",
                  "description": "Squares numbers given in input until a -1 is given!",
                  "github_url": "https://github.com/grahambartley/db66d80f-0de1-4a89-ab03-4e71a3ecb26d",
                  "resource_url": null,
                  "created_at": "2018-04-11T17:19:44.999Z",
                  "updated_at": null,
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "d9f1e025-d87d-41bb-8c1e-1f25b1890a1a",
                  "name": "Sample Project",
                  "type": "python",
                  "entrypoint": "main.py",
                  "description": "Hello World!",
                  "github_url": "https://github.com/grahambartley/d9f1e025-d87d-41bb-8c1e-1f25b1890a1a",
                  "resource_url": null,
                  "created_at": "2018-04-17T11:59:56.026Z",
                  "updated_at": null,
                  "author": "Youth Four",
                  "user_id": "fe281cd2-cc45-1930-0011-a67c329f91d2",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              }
          ]);
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
    it('should not get project data for an invalid dojo id', (done) => {
      const dojoIdMock = '1234-5678';
      request(serverInstance)
        .get(`/api/2.0/projects/projects-for-dojo/${dojoIdMock}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.deep.equal([]);
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });
  describe('GET /api/2.0/projects/projects-for-user/:userId', () => {
    it('should get the projects for a given user id', (done) => {
      const userIdMock = '12a4df02-6cbd-40b0-b2df-2531b136afec';
      request(serverInstance)
        .get(`/api/2.0/projects/projects-for-user/${userIdMock}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.deep.equal([
              {
                  "project_id": "f7f877f1-fea9-4451-9945-1d98fac2dcf4",
                  "name": "Chess",
                  "type": "python",
                  "entrypoint": "Chess.py",
                  "description": "Command line chess written in Python!",
                  "github_url": "https://github.com/grahambartley/f7f877f1-fea9-4451-9945-1d98fac2dcf4",
                  "resource_url": null,
                  "created_at": "2018-03-31T18:20:59.952Z",
                  "updated_at": null,
                  "author": "Youth One",
                  "user_id": "12a4df02-6cbd-40b0-b2df-2531b136afec",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "39cc1218-1cc0-46af-9608-eb841d252afc",
                  "name": "Current Date and Time",
                  "type": "javascript",
                  "entrypoint": "index.js",
                  "description": "Displays the current date and time in ISO format using momentjs.",
                  "github_url": "https://github.com/grahambartley/39cc1218-1cc0-46af-9608-eb841d252afc",
                  "resource_url": null,
                  "created_at": "2018-03-31T18:33:52.453Z",
                  "updated_at": "2018-04-10T10:12:00.560Z",
                  "author": "Youth One",
                  "user_id": "12a4df02-6cbd-40b0-b2df-2531b136afec",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "ca681aea-ce69-4d89-bbc8-11db6f8e1ac3",
                  "name": "My First Website",
                  "type": "html",
                  "entrypoint": "index.html",
                  "description": "The first website I created as part of my sessions with Awesome Dojo!",
                  "github_url": "https://github.com/grahambartley/ca681aea-ce69-4d89-bbc8-11db6f8e1ac3",
                  "resource_url": null,
                  "created_at": "2018-03-31T18:35:28.402Z",
                  "updated_at": "2018-04-14T22:20:56.232Z",
                  "author": "Youth One",
                  "user_id": "12a4df02-6cbd-40b0-b2df-2531b136afec",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              },
              {
                  "project_id": "d508227e-263a-4af8-ac9d-249a4a7dbe3f",
                  "name": "Django Project",
                  "type": "python",
                  "entrypoint": "test.py",
                  "description": "Prints out the current version of Django being used.",
                  "github_url": "https://github.com/grahambartley/d508227e-263a-4af8-ac9d-249a4a7dbe3f",
                  "resource_url": null,
                  "created_at": "2018-03-31T19:09:55.570Z",
                  "updated_at": null,
                  "author": "Youth One",
                  "user_id": "12a4df02-6cbd-40b0-b2df-2531b136afec",
                  "github_integration_id": "b301386a-75cc-438d-873b-7fb8f937a9a0",
                  "deleted_at": null
              }
          ]);
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
    it('should not get projects for an invalid user id', (done) => {
      const userIdMock = '1234-5678';
      request(serverInstance)
        .get(`/api/2.0/projects/projects-for-user/${userIdMock}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.deep.equal([]);
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });
  describe('POST /api/2.0/projects/create-project', () => {
    it('should not create a project with invalid data', (done) => {
      const payload = {
        dojoId: '1234-5678',
      };
      request(serverInstance)
        .post(`/api/2.0/projects/create-project`)
        .send(payload)
        .expect(404)
        .expect((res) => {
          expect(res.error.text).to.equal('Error');
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });
  describe('POST /api/2.0/projects/update-project', () => {
    it('should not create a project with invalid data', (done) => {
      const payload = {
        dojoId: '1234-5678',
      };
      request(serverInstance)
        .post(`/api/2.0/projects/update-project`)
        .send(payload)
        .expect(404)
        .expect((res) => {
          expect(res.error.text).to.equal('Error');
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });
  describe('POST /api/2.0/projects/increment-project-plays', () => {
    it('should increment the project plays by 1 for a project id', (done) => {
      const payload = {
        projectId: '16433d6f-ea35-4119-9a1e-8e34222631bd',
      };
      request(serverInstance)
        .post(`/api/2.0/projects/increment-project-plays`)
        .send(payload)
        .expect(200)
        .expect((res) => {
          expect(res.text).to.equal('plays successfully updated');
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
    it('should not increment the project plays for an invalid project id', (done) => {
      const payload = {
        projectId: '1234-5678',
      };
      request(serverInstance)
        .post(`/api/2.0/projects/increment-project-plays`)
        .send(payload)
        .expect(404)
        .expect((res) => {
          expect(res.error.text).to.equal('Not found');
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });
  describe('POST /api/2.0/projects/delete-project', () => {
    it('should set deleted at time for the given project id', (done) => {
      const payload = {
        projectId: 'ca681aea-ce69-4d89-bbc8-11db6f8e1ac3',
      };
      request(serverInstance)
        .post(`/api/2.0/projects/delete-project`)
        .send(payload)
        .expect(200)
        .expect((res) => {
          expect(res.text).to.equal('successful project deletion');
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });
});