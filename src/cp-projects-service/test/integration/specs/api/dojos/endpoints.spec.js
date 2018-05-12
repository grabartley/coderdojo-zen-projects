import chai from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import proxyquire from 'proxyquire';
import server from '../../../../../src/api/server';
import testData from '../../../../../db/test-data';
const expect = chai.expect;

describe('Dojos API', () => {
  let serverInstance;
  const endpointsDependencyMocks = {
    '../../services/github-service': {
      getAccessToken: sinon.stub(),
    },
  };
  endpointsDependencyMocks['../../services/github-service'].getAccessToken.returns('data=exampleAccessToken&data');
  const endpoints = proxyquire('../../../../../src/api/dojos/endpoints', endpointsDependencyMocks);
  const serverDependencyMocks = {
    './dojos/endpoints': endpoints,
  };
  const server = proxyquire('../../../../../src/api/server', serverDependencyMocks);
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
  describe('GET /api/2.0/dojos/:dojoId', () => {
    it('should get the dojo data for a given dojo id', (done) => {
      const dojoIdMock = '54b7f667-6c3c-acbd-bb4c-0911a6e7cd5d';
      request(serverInstance)
        .get(`/api/2.0/dojos/${dojoIdMock}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.deep.equal({
              id: '54b7f667-6c3c-acbd-bb4c-0911a6e7cd5d',
              name: 'Awesome Dojo',
              champion_ids: [ 'ff67df02-6cbd-29c6-b2df-283e5136afec' ]
          });
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    }).timeout(10000);
    it('should not get the dojo data for a dojo id which doesn\'t exist', (done) => {
      const dojoIdMock = '1234-5678';
      request(serverInstance)
        .get(`/api/2.0/dojos/${dojoIdMock}`)
        .expect(404)
        .expect((res) => {
          expect(res.error.text).to.equal('Not found');
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    }).timeout(10000);
  });
  describe('GET /api/2.0/dojos/dojos-for-user/:userId', () => {
    it('should return the dojo data for the joined dojos of the given user', (done) => {
      const userIdMock = '12a4df02-6cbd-40b0-b2df-2531b136afec';
      request(serverInstance)
        .get(`/api/2.0/dojos/dojos-for-user/${userIdMock}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.deep.equal([
            {
                id: '54b7f667-6c3c-acbd-bb4c-0911a6e7cd5d',
                name: 'Awesome Dojo',
                champion_ids: [ 'ff67df02-6cbd-29c6-b2df-283e5136afec' ]
            }
          ]);
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    }).timeout(10000);
  });
  describe('GET /api/2.0/dojos/dojos-for-user-with-github/:userId', () => {
    it('should return the dojo data for the joined dojos of the given user which have GitHub integrated', (done) => {
      const userIdMock = 'fe281cd2-cc45-1930-0011-a67c329f91d2';
      request(serverInstance)
        .get(`/api/2.0/dojos/dojos-for-user-with-github/${userIdMock}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.deep.equal([
            {
                id: '54b7f667-6c3c-acbd-bb4c-0911a6e7cd5d',
                name: 'Awesome Dojo',
                champion_ids: [ 'ff67df02-6cbd-29c6-b2df-283e5136afec' ]
            }
          ]);
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    }).timeout(10000);
  });
  describe('GET /api/2.0/dojos/dojo-by-github-integration/:githubId', () => {
    it('should return the dojo data for the given github integration id', (done) => {
      const githubIdMock = 'b301386a-75cc-438d-873b-7fb8f937a9a0';
      request(serverInstance)
        .get(`/api/2.0/dojos/dojo-by-github-integration/${githubIdMock}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.deep.equal({
              id: '54b7f667-6c3c-acbd-bb4c-0911a6e7cd5d',
              name: 'Awesome Dojo',
              champion_ids: [ 'ff67df02-6cbd-29c6-b2df-283e5136afec' ]
          });
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    }).timeout(10000);
    it('should not return dojo data for a github integration id that doesn\'t exist', (done) => {
      const githubIdMock = '1234-5678';
      request(serverInstance)
        .get(`/api/2.0/dojos/dojo-by-github-integration/${githubIdMock}`)
        .expect(404)
        .expect((res) => {
          expect(res.error.text).to.equal('Not found');
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    }).timeout(10000);
  });
  describe('GET /api/2.0/dojos/is-github-integrated/:dojoId', () => {
    it('should return true for dojo which has github integrated', (done) => {
      const dojoIdMock = '54b7f667-6c3c-acbd-bb4c-0911a6e7cd5d';
      request(serverInstance)
        .get(`/api/2.0/dojos/is-github-integrated/${dojoIdMock}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.be.true;
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    }).timeout(10000);
    it('should return false for dojo which does not have github integrated', (done) => {
      const dojoIdMock = '7382a5ff-bce6-9200-b3d2-aa76b12106b5';
      request(serverInstance)
        .get(`/api/2.0/dojos/is-github-integrated/${dojoIdMock}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.be.false;
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    }).timeout(10000);
  });
  describe('POST /api/2.0/dojos/:dojoId/:userId/integrations/github', () => {
    it('should create a github integration for a valid payload', (done) => {
      const dojoIdMock = '18d376b4-22a4-ed8d-7355-9034bb7b0034';
      const userIdMock = '836473b4-4889-221a-9100-201994ff392d';
      const payload = {
        client_id: '8765-4321',
        code: '1234-5678',
        client_secret: '5678-1234',
      };
      request(serverInstance)
        .post(`/api/2.0/dojos/${dojoIdMock}/${userIdMock}/integrations/github`)
        .send(payload)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    }).timeout(20000);
    it('should not create a github integration for an invalid payload', (done) => {
      const dojoIdMock = '1234-5678';
      const userIdMock = '836473b4-4889-221a-9100-201994ff392d';
      const payload = {
        client_id: '8765-4321',
        code: '1234-5678',
        client_secret: '5678-1234',
      };
      request(serverInstance)
        .post(`/api/2.0/dojos/${dojoIdMock}/${userIdMock}/integrations/github`)
        .send(payload)
        .expect(404)
        .expect((res) => {
          expect(res.error.text).to.equal('Error');
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    }).timeout(20000);
  });
  describe('POST /api/2.0/dojos/:dojoId/remove-github-integration', () => {
    it('should remove a github integration for a valid dojo id', (done) => {
      const dojoIdMock = '54b7f667-6c3c-acbd-bb4c-0911a6e7cd5d';
      request(serverInstance)
        .post(`/api/2.0/dojos/${dojoIdMock}/remove-github-integration`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    }).timeout(10000);
    it('should not remove a github integration for an invalid dojo id', (done) => {
      const dojoIdMock = '1234-5678';
      request(serverInstance)
        .post(`/api/2.0/dojos/${dojoIdMock}/remove-github-integration`)
        .expect(404)
        .expect((res) => {
          expect(res.error.text).to.equal('Not found');
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    }).timeout(10000);
  });
});