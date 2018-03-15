// import migrations from '../db-migrations';
import dbService from '../services/db-service';

// loads test data into the database (requires environment variables for db authentication)
async function loadTestData() {
  await dbService.query(`
    INSERT INTO users (id, email, name, dojos) VALUES ('ff67df02-6cbd-29c6-b2df-283e5136afec', 'champion1@example.com', 'Champion One', '{"54b7f667-6c3c-acbd-bb4c-0911a6e7cd5d"}');
    INSERT INTO users (id, email, name, dojos) VALUES ('836473b4-4889-221a-9100-201994ff392d', 'champion2@example.com', 'Champion Two', '{"18d376b4-22a4-ed8d-7355-9034bb7b0034"}');
    INSERT INTO users (id, email, name, dojos) VALUES ('27ab4d66-c3dw-d9f3-aa45-839402a7bee3', 'champion3@example.com', 'Champion Three', '{"7382a5ff-bce6-9200-b3d2-aa76b12106b5"}');
    INSERT INTO users (id, email, name, dojos) VALUES ('028ddf02-6cbd-4b98-b2df-2531b136afec', 'parent1@example.com', 'Parent One', '{"54b7f667-6c3c-acbd-bb4c-0911a6e7cd5d", "7382a5ff-bce6-9200-b3d2-aa76b12106b5"}');
    INSERT INTO users (id, email, name, dojos) VALUES ('2293049b-6332-5611-fd54-920ab2029183', 'parent2@example.com', 'Parent Two', '{"18d376b4-22a4-ed8d-7355-9034bb7b0034"}');
    INSERT INTO users (id, email, name, dojos) VALUES ('dff82fc7-aa6c-7821-1213-c78dc7f21133', 'parent3@example.com', 'Parent Three', '{"54b7f667-6c3c-acbd-bb4c-0911a6e7cd5d", "18d376b4-22a4-ed8d-7355-9034bb7b0034", "7382a5ff-bce6-9200-b3d2-aa76b12106b5"}');
    INSERT INTO users (id, email, name, dojos) VALUES ('12a4df02-6cbd-40b0-b2df-2531b136afec', 'child1@example.com', 'Child One', '{"54b7f667-6c3c-acbd-bb4c-0911a6e7cd5d"}');
    INSERT INTO users (id, email, name, dojos) VALUES ('b850ff0a-232e-a532-b672-839d9a99d291', 'child2@example.com', 'Child Two', '{"54b7f667-6c3c-acbd-bb4c-0911a6e7cd5d", "7382a5ff-bce6-9200-b3d2-aa76b12106b5"}');
    INSERT INTO users (id, email, name, dojos) VALUES ('c2818fa8-8188-7dd8-45bc-38200acc0f90', 'child3@example.com', 'Child Three', '{"18d376b4-22a4-ed8d-7355-9034bb7b0034"}');
    INSERT INTO users (id, email, name, dojos) VALUES ('fe281cd2-cc45-1930-0011-a67c329f91d2', 'child4@example.com', 'Child Four', '{"54b7f667-6c3c-acbd-bb4c-0911a6e7cd5d", "18d376b4-22a4-ed8d-7355-9034bb7b0034", "7382a5ff-bce6-9200-b3d2-aa76b12106b5"}');
    INSERT INTO dojos (id, name) VALUES ('54b7f667-6c3c-acbd-bb4c-0911a6e7cd5d', 'Awesome Dojo');
    INSERT INTO dojos (id, name) VALUES ('18d376b4-22a4-ed8d-7355-9034bb7b0034', 'My Local Dojo');
    INSERT INTO dojos (id, name) VALUES ('7382a5ff-bce6-9200-b3d2-aa76b12106b5', 'School Dojo');
    INSERT INTO dojos (id, name) VALUES ('bb436a66-13ff-c456-1000-b3b4c88a7271', 'Library Dojo');
  `);
}

// load the test data
loadTestData();