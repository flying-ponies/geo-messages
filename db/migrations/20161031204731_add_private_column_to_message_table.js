
exports.up = function(knex, Promise) {
  return knex.schema.table('messages', (table) => {
    table.boolean('private').notNullable().defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('messages', (table) => {
    table.dropColumn('private');
  });
};
