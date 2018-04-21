import proxyquire from 'proxyquire';
import chai from 'chai';
const expect = chai.expect;

describe('DBService', () => {
  describe('query', () => {
    it('should execute the given query on the database', () => {
      // ARRANGE
      const queryMock = {
        text: 'exampleQuery',
        values: [],
      };
      const dependencyMocks = {
        'pg': {
          Pool: () => {
            return {
              query: (query) => {
                if (JSON.stringify(query) === JSON.stringify(queryMock)) {
                  return 'expectedResponse';
                }
              },
            };
          },
        },
      };
      const DBServiceMock = proxyquire('../../../../src/services/db-service', dependencyMocks);
      
      // ACT
      const result = DBServiceMock.query(queryMock);
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
});