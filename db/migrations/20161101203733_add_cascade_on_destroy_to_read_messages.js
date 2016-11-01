
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.raw('ALTER TABLE read_messages DROP CONSTRAINT read_messages_user_id_foreign'),
    knex.schema.raw('ALTER TABLE read_messages ADD CONSTRAINT read_messages_user_id_foreign FOREIGN KEY (user_id) REFERENCES users ON DELETE CASCADE;'),
    knex.schema.raw('ALTER TABLE read_messages DROP CONSTRAINT read_messages_message_id_foreign'),
    knex.schema.raw('ALTER TABLE read_messages ADD CONSTRAINT read_messages_message_id_foreign FOREIGN KEY (message_id) REFERENCES messages ON DELETE CASCADE;')
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.raw('ALTER TABLE read_messages DROP CONSTRAINT read_messages_user_id_foreign'),
    knex.schema.raw('ALTER TABLE read_messages ADD CONSTRAINT read_messages_user_id_foreign FOREIGN KEY (user_id) REFERENCES users;'),
    knex.schema.raw('ALTER TABLE read_messages DROP CONSTRAINT read_messages_message_id_foreign'),
    knex.schema.raw('ALTER TABLE read_messages ADD CONSTRAINT read_messages_message_id_foreign FOREIGN KEY (message_id) REFERENCES messages;')
  ]);
};
