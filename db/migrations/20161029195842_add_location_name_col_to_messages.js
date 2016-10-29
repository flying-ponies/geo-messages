
exports.up = function(knex, Promise) {
  return knex.schema.table('messages', (table) => {
    table.string('location_name');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('messages', (table) => {
    table.dropColumn('location_name');
  });
};
