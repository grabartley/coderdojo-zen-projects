import proxyquire from 'proxyquire';
import chai from 'chai';
const expect = chai.expect;

describe('DBService', () => {
  describe('query', () => {
    it('should execute the given query on the database', async () => {
      // ARRANGE
      const dependencyMocks = {
        'pg': {
          Pool: () => {
            return {
              query: (queryString) => {
                if (queryString === 'exampleQuery') {
                  return Promise.resolve('expectedResponse');
                }
              },
            };
          },
        },
      };
      const DBServiceMock = proxyquire('../../../../src/services/db-service', dependencyMocks);
      
      // ACT
      const result = await DBServiceMock.query('exampleQuery');
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
  
  describe('insertInto', () => {
    it('should construct and execute the appropriate INSERT INTO query on the database', async () => {
      // ARRANGE
      const tableNameMock = 'exampleTable';
      const columnNamesMock = ['column1', 'column2', 'column3'];
      const valuesMock = ['value1', 'value2', 'value3'];
      const expectedQueryString = 'INSERT INTO exampleTable(column1, column2, column3) VALUES ($1, $2, $3)'
      const expectedQuery = {
        text: expectedQueryString,
        values: valuesMock,
      };
      const dependencyMocks = {
        'pg': {
          Pool: () => {
            return {
              query: (query) => {
                if (JSON.stringify(query) === JSON.stringify(expectedQuery)) {
                  return Promise.resolve('expectedResponse');
                }
              },
            };
          },
        },
      };
      const DBServiceMock = proxyquire('../../../../src/services/db-service', dependencyMocks);
      
      // ACT
      const result = await DBServiceMock.insertInto(tableNameMock, columnNamesMock, valuesMock);
      
      // ASSERT
      expect(result).to.equal('expectedResponse');
    });
  });
});