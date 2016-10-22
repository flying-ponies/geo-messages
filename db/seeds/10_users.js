const bcrypt = require('bcryptjs');
function generatePassHash(password) {
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({
          username: 'devin',
          email: 'devin.gir@gmail.com',
          password_digest: generatePassHash('secret')
        }),
        knex('users').insert({
          username: 'john',
          email: 'jchow417@gmail.com',
          password_digest: generatePassHash('secret')
        }),
        knex('users').insert({
          username: 'alex',
          email: 'alex@alexanderdraper.com',
          password_digest: generatePassHash('secret')
        })
      ]);
    });
};
