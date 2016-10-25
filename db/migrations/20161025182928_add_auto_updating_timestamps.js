
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (table) => {
      table.timestamps(true, true);
    }),
    knex.schema.table('messages', (table) => {
      table.timestamps(true, true);
    }),
    knex.schema.table('read_messages', (table) => {
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', (table) => {
      table.dropColumns('created_at', 'updated_at');
    }),
    knex.schema.table('messages', (table) => {
      table.dropColumns('created_at', 'updated_at');
    }),
    knex.schema.table('read_messages', (table) => {
      table.dropColumns('created_at', 'updated_at');
    })
  ]);
};
