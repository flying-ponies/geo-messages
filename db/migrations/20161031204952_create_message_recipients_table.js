
exports.up = function(knex, Promise) {
  return knex.schema.createTable('message_recipients', (table) => {
    table.increments('id');
    table.integer('user_id').references('id').inTable('users').notNullable();
    table.integer('message_id').references('id').inTable('messages').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('message_recipients');
};
