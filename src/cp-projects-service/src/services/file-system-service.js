import fs from 'file-system';

// recursively and synchronously lists a directory and returns the results in an array containing file path and base64 encoded content
function recursiveListSync(dirPath, list = []) {
  // read all files in the top level of this directory
  let filesFromDirectory = fs.readdirSync(dirPath);
  // for each file
  filesFromDirectory.forEach((file) => {
    const filePath = `${dirPath}${file}`;
    // if it's a directory, make a recursive call to list it
    if (fs.statSync(`${filePath}`).isDirectory()) {
      list = recursiveListSync(`${filePath}/`, list);
    } else {
      // otherwise if it's a file, add it's path and base64 content to the array
      list.push({
        path: `${filePath}`,
        content: fs.readFileSync(`${filePath}`, 'base64'),
      });
    }
  });
  return list;
}

module.exports = {
  recursiveListSync: recursiveListSync,
};