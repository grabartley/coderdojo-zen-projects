import sinon from 'sinon';
import proxyquire from 'proxyquire';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinonChai from 'sinon-chai';
import migrations from '../../../../../src/db-migrations';
const expect = chai.expect;

// used to test API endpoints
chai.use(chaiHttp);
// used to assert on sinon
chai.use(sinonChai);

describe('UsersAPI', () => {
  describe('GET /api/2.0/profiles/load-user-profile/:userId', () => {
    it('should get the profile for a given user id', () => {
      
    }).timeout(10000);
  });
});