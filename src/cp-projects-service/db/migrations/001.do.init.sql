-- tmp table for prototype
CREATE TABLE IF NOT EXISTS users (
  id varchar NOT NULL UNIQUE,
  email varchar NOT NULL UNIQUE,
  name varchar NOT NULL,
  type varchar NOT NULL,
  dojos varchar[],
  PRIMARY KEY (id)
);

-- tmp table for prototype
CREATE TABLE IF NOT EXISTS dojos (
  id varchar NOT NULL UNIQUE,
  name varchar NOT NULL,
  champion_ids varchar[] NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS github_integrations (
  github_integration_id varchar NOT NULL UNIQUE,
  dojo_id varchar NOT NULL UNIQUE,
  user_id varchar NOT NULL,
  github_access_token varchar,
  PRIMARY KEY (github_integration_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (dojo_id) REFERENCES dojos(id)
);

CREATE TABLE IF NOT EXISTS projects (
  project_id varchar NOT NULL UNIQUE,
  name varchar NOT NULL,
  type varchar NOT NULL,
  entrypoint varchar NOT NULL,
  description varchar,
  github_url varchar NOT NULL,
  resource_url varchar,
  created_at timestamp NOT NULL,
  updated_at timestamp NULL DEFAULT NULL,
  author varchar NOT NULL,
  user_id varchar NOT NULL,
  github_integration_id varchar NOT NULL,
  deleted_at timestamp NULL DEFAULT NULL,
  PRIMARY KEY (project_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (github_integration_id) REFERENCES github_integrations(github_integration_id)
);

CREATE TABLE IF NOT EXISTS project_statistics (
  project_statistics_id varchar NOT NULL UNIQUE,
  project_id varchar NOT NULL UNIQUE,
  plays bigint DEFAULT 0,
  PRIMARY KEY (project_statistics_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id)
);