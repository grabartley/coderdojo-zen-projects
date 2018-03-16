import fs from 'file-system';

// recursively and synchronously lists a directory and returns the results in an array containing file path and base64 encoded content
function recursiveListSync(dirPath, list = []) {
  // read all files in the top level of this directory
  let filesFromDirectory = fs.readdirSync(dirPath);
  // for each file
  filesFromDirectory.forEach((file) => {
    // if it's a directory, make a recursive call to list it
    if (fs.statSync(dirPath + file).isDirectory()) {
      list = recursiveListSync(dirPath + file + '/', list);
    } else {
      // otherwise if it's a file, add it's path and base64 content to the array
      list.push({
        path: dirPath + file,
        content: fs.readFileSync(dirPath + file, 'base64'),
      });
    }
  });
  return list;
}

module.exports = {
  recursiveListSync: recursiveListSync,
};