const bcrypt = require('bcryptjs');
function generatePassHash(password) {
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('read_messages').del()
    .then(() => {
      return knex('message_recipients').del();
    })
    .then(() => {
      return knex('messages').del();
    })
    .then(() => {
      return knex('users').del();
    })
    .then(() => {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({
          id: 1,
          username: 'devin',
          email: 'devin.gir@gmail.com',
          password_digest: generatePassHash('secret')
        }),
        knex('users').insert({
          id: 2,
          username: 'john',
          email: 'jchow417@gmail.com',
          password_digest: generatePassHash('secret')
        }),
        knex('users').insert({
          id: 3,
          username: 'alex',
          email: 'alex@alexanderdraper.com',
          password_digest: generatePassHash('secret')
        })
      ]);
    });
};
