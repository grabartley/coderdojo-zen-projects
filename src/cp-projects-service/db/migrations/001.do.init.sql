-- tmp table for prototype
CREATE TABLE IF NOT EXISTS users (
  id varchar NOT NULL,
  email varchar,
  name varchar,
  dojos varchar[],
  PRIMARY KEY (id)
);

-- tmp table for prototype
CREATE TABLE IF NOT EXISTS dojos (
  id varchar NOT NULL,
  name varchar,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS github_integrations (
  github_integration_id varchar NOT NULL,
  user_id varchar NOT NULL,
  dojo_id varchar NOT NULL,
  github_access_token varchar,
  PRIMARY KEY (github_integration_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (dojo_id) REFERENCES dojos(id)
);

CREATE TABLE IF NOT EXISTS projects (
  project_id varchar NOT NULL,
  name varchar,
  type varchar,
  entrypoint varchar,
  description varchar,
  github varchar,
  created_at timestamp,
  updated_at timestamp,
  author varchar,
  user_id varchar NOT NULL,
  github_integration_id varchar,
  deleted_at timestamp,
  PRIMARY KEY (project_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (github_integration_id) REFERENCES github_integrations(github_integration_id)
);