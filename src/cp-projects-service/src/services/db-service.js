import { Pool } from 'pg';

const db = new Pool();

// executes the given query on the database
function query(query) {
  return db.query(query);
}

module.exports = {
  query: query,
};