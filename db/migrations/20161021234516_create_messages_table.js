
exports.up = function(knex, Promise) {
  return knex.schema.createTable('messages', (table) => {
    table.increments('id');
    table.string('title');
    table.text('content').notNullable();
    table.integer('user_id').references('id').inTable('users');
    table.timestamps();
  }).then((results) => {
    return knex.raw("SELECT AddGeometryColumn ('messages', 'location', 4326, 'POINT', 2);");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('messages');
};
