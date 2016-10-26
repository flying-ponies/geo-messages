
exports.up = function(knex, Promise) {
  return knex.schema.table('read_messages', (table) => {
    table.dropColumn('rating');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('read_messages', (table) => {
    table.integer('rating').defaultTo(0);
  });
};
