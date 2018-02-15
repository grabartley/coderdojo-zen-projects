import fs from 'file-system';

// generate a unique id for a new project of the following form:
// 8-4-4-4-12 where the numbers represent the amount of characters
// each character is in range (a-z0-9)
// format may change in the future
function generateProjectId() {
  let idIsUnique = false;
  let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id;
  
  // while a unique id has not been found
  while (!idIsUnique) {
    let index;
    let numOfCharacters;
    id = '';
    for (let i = 0; i < 4; i++) {
      if (i == 0) {
        numOfCharacters = 8;
      } else {
        numOfCharacters = 4;
      }
      for (let i = 0; i < numOfCharacters; i++) {
        index = Math.floor(Math.random() * possibleCharacters.length);
        id += possibleCharacters[index];
      }
      id += '-';
    }
    for (let i = 0; i < 12; i++) {
      index = Math.floor(Math.random() * possibleCharacters.length);
      id += possibleCharacters[index];
    }
    
    idIsUnique = module.exports.checkIsIdUnique(id);
  }
  return id;
}

// check if the given id is a unique id (using file system for prototype rather than db)
function checkIsIdUnique(id) {
  let isUnique = true;
  
  fs.readdirSync('./projects').forEach((projectId) => {
    if (id === projectId) {
      isUnique = false;
    }
  });
  
  return isUnique;
}

// exported functions
module.exports = {
  generateProjectId: generateProjectId,
  checkIsIdUnique: checkIsIdUnique,
};