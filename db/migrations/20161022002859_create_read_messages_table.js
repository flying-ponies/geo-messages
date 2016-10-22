
exports.up = function(knex, Promise) {
  return knex.schema.createTable('read_messages', (table) => {
    table.increments('id');
    table.integer('rating').defaultTo(0);
    table.integer('user_id').references('id').inTable('users');
    table.integer('message_id').references('id').inTable('messages');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('read_messages');
};
