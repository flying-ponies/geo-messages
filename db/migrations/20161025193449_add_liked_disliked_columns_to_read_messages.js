
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('read_messages', (table) => {
      table.integer('liked').defaultTo(0).notNullable();//.knex.raw('CHECK (liked = 0 OR liked = 1)');
      table.integer('disliked').defaultTo(0).notNullable();//.knex.raw('CHECK (disliked = 0 OR disliked = 1)');
    }),
    knex.schema.raw('ALTER TABLE read_messages ADD CHECK (liked = 0 OR disliked = 0)'),
    knex.schema.raw('ALTER TABLE read_messages ADD CHECK (liked = 0 OR liked = 1)'),
    knex.schema.raw('ALTER TABLE read_messages ADD CHECK (disliked = 0 OR disliked = 1)')
  ]);
};

exports.down = function(knex, Promise) {
  return knex.schema.table('read_messages', (table) => {
    table.dropColumns('liked', 'disliked');
  });
};
