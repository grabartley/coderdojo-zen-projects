import chai from 'chai';
import request from 'supertest';
import server from '../../../../../src/api/server';
import testData from '../../../../../db/test-data';
const expect = chai.expect;

describe('Users API', () => {
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
  describe('GET /api/2.0/profiles/load-user-profile/:userId', () => {
    it('should get the profile for a given user id', (done) => {
      const userIdMock = 'ff67df02-6cbd-29c6-b2df-283e5136afec';
      request(serverInstance)
        .get(`/api/2.0/profiles/load-user-profile/${userIdMock}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.deep.equal({
            id: 'ff67df02-6cbd-29c6-b2df-283e5136afec',
            email: 'champion1@example.com',
            name: 'Champion One',
            type: 'champion',
            dojos: [ '54b7f667-6c3c-acbd-bb4c-0911a6e7cd5d' ] 
          });
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
    it('should not get the profile for a user id which doesn\'t exist', (done) => {
      const userIdMock = '1234-5678';
      request(serverInstance)
        .get(`/api/2.0/profiles/load-user-profile/${userIdMock}`)
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
  describe('GET /api/2.0/users/is-champion/:userId/:dojoId', () => {
    it('should return true for a champion', (done) => {
      const userIdMock = 'ff67df02-6cbd-29c6-b2df-283e5136afec';
      const dojoIdMock = '54b7f667-6c3c-acbd-bb4c-0911a6e7cd5d';
      request(serverInstance)
        .get(`/api/2.0/users/is-champion/${userIdMock}/${dojoIdMock}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.be.true;
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
    it('should return false if not a champion', (done) => {
      const userIdMock = 'ff67df02-6cbd-29c6-b2df-283e5136afec';
      const dojoIdMock = '18d376b4-22a4-ed8d-7355-9034bb7b0034';
      request(serverInstance)
        .get(`/api/2.0/users/is-champion/${userIdMock}/${dojoIdMock}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.be.false;
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
    it('should return an error for an invalid dojo id', (done) => {
      const userIdMock = 'ff67df02-6cbd-29c6-b2df-283e5136afec';
      const dojoIdMock = '1234-5678';
      request(serverInstance)
        .get(`/api/2.0/users/is-champion/${userIdMock}/${dojoIdMock}`)
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
  describe('POST /api/2.0/users/login', () => {
    it('should return user data for the given user id', (done) => {
      const payload = {
        email: 'youth1@example.com',
      };
      request(serverInstance)
        .post('/api/2.0/users/login')
        .send(payload)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.deep.equal({
            id: '12a4df02-6cbd-40b0-b2df-2531b136afec',
            email: 'youth1@example.com',
            name: 'Youth One',
            type: 'youth-o13',
            dojos: [ '54b7f667-6c3c-acbd-bb4c-0911a6e7cd5d' ]
        });
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });
});