import proxyquire from 'proxyquire';
import chai from 'chai';
const expect = chai.expect;

describe('FileSystemService', () => {
  describe('recursiveListSync', () => {
    it('should return a list of file objects for the given directory and all sub directories', () => {
      // ARRANGE
      const dirPathMock = './test/';
      const expectedListResponse = [
        {
          path: './test/test.py',
          content: 'fileContents',
        },
        {
          path: './test/helper.py',
          content: 'fileContents',
        },
        {
          path: './test/subFolder/anotherFile.py',
          content: 'fileContents',
        },
      ];
      const dependencyMocks = {
        'file-system': {
          readdirSync: (dirPath) => {
            if (dirPath === dirPathMock) {
              return [
                'test.py',
                'helper.py',
                'subFolder',
              ];
            } else {
              return [
                'anotherFile.py'
              ];
            }
          },
          statSync: (filePath) => {
            return {
              isDirectory: () => {
                if (filePath === './test/subFolder') {
                  return true;
                } else {
                  return false;
                }
              },
            };
          },
          readFileSync: (filePath, encoding) => {
            return 'fileContents';
          },
        },
      };
      const FileSystemServiceMock = proxyquire('../../../../src/services/file-system-service', dependencyMocks);
      
      // ACT
      const listResponse = FileSystemServiceMock.recursiveListSync(dirPathMock);
      
      // ASSERT
      expect(listResponse).to.deep.equal(expectedListResponse);
    });
  });
});