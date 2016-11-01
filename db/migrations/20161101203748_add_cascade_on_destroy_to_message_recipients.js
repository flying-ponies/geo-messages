
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.raw('ALTER TABLE message_recipients DROP CONSTRAINT message_recipients_user_id_foreign'),
    knex.schema.raw('ALTER TABLE message_recipients ADD CONSTRAINT message_recipients_user_id_foreign FOREIGN KEY (user_id) REFERENCES users ON DELETE CASCADE;'),
    knex.schema.raw('ALTER TABLE message_recipients DROP CONSTRAINT message_recipients_message_id_foreign'),
    knex.schema.raw('ALTER TABLE message_recipients ADD CONSTRAINT message_recipients_message_id_foreign FOREIGN KEY (message_id) REFERENCES messages ON DELETE CASCADE;')
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.raw('ALTER TABLE message_recipients DROP CONSTRAINT message_recipients_user_id_foreign'),
    knex.schema.raw('ALTER TABLE message_recipients ADD CONSTRAINT message_recipients_user_id_foreign FOREIGN KEY (user_id) REFERENCES users;'),
    knex.schema.raw('ALTER TABLE message_recipients DROP CONSTRAINT message_recipients_message_id_foreign'),
    knex.schema.raw('ALTER TABLE message_recipients ADD CONSTRAINT message_recipients_message_id_foreign FOREIGN KEY (message_id) REFERENCES messages;')
  ]);
};
