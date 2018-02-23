import { Pool } from 'pg';

const db = new Pool();

// executes the given qurery on the database
async function query(queryString) {
  return await db.query(queryString);
}

// constructs and executes an SQL query to insert given values into given tableName columnNames
async function insertInto(tableName, columnNames, values) {
  // construct query String
  let queryString = 'INSERT INTO ' + tableName + '(';
  
  columnNames.forEach((column) => {
    queryString += column + ', ';
  });
  
  queryString = queryString.substring(0, queryString.length - 2) + ') VALUES (';
  
  for (let i = 1; i <= values.length; i++) {
    queryString += '$' + i + ', '
  }
  
  queryString = queryString.substring(0, queryString.length - 2) + ')';
  
  // create query object with String and values array
  const query = {
    text: queryString,
    values: values
  };
  
  // execute query object
  return await db.query(query);
}

module.exports = {
  query: query,
  insertInto: insertInto,
};