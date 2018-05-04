import Postgrator from 'postgrator';

// run all database migrations that have not already been run
function migrate() {
  const postgrator = new Postgrator({
    migrationDirectory: './db/migrations',
    driver: 'pg',
    host: process.env.PGHOST || 'localhost',
    port: 5432,
    database: 'cp_projects_service',
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    newline: 'CRLF'
  });
  
  postgrator.migrate('max', (err, res) => {
    postgrator.endConnection();
  });
}

module.exports = {
  migrate: migrate,
};