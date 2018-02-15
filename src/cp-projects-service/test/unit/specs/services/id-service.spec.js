import IDService from '../../../../src/services/id-service';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;

describe('IDService', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  
  describe('generateProjectId', () => {
    it('should generate a unique project ID', () => {
      // ARRANGE
      sandbox.stub(IDService, 'checkIsIdUnique').returns(true);
      
      // ACT
      const generatedId = IDService.generateProjectId();
      
      // ASSERT
      expect(IDService.checkIsIdUnique).to.have.been.calledWith(generatedId);
      expect(generatedId.length).to.equal(36);
    });
  });
  
  describe('checkIsIdUnique', () => {
    it('should return true if the given project ID is unique and false if not', () => {
      // ARRANGE
      const dependencyMocks = {
        'file-system': {
          readdirSync: (path) => {
            return ['1234-5678'];
          },
        },
      };
      const IDServiceMock = proxyquire('../../../../src/services/id-service', dependencyMocks);
      
      // ACT
      let isUnique = IDServiceMock.checkIsIdUnique('5678-1234');
      
      // ASSERT
      expect(isUnique).to.equal(true);
      
      // ACT
      isUnique = IDServiceMock.checkIsIdUnique('1234-5678');
      
      // ASSERT
      expect(isUnique).to.equal(false);
    });
  });
});