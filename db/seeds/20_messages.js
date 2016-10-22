
exports.seed = function(knex, Promise) {
  const st = require('knex-postgis')(knex);

  // Deletes ALL existing entries
  return knex('messages').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('messages').insert({
          title: 'A Message From Devin',
          content: 'My name is Devin. This is a message. Hopefully it is in Vancouver.',
          user_id: knex.select('id').from('users').where({ username: 'devin' }),
          location: st.geomFromText('Point(-123.1207 49.2827)', 4326)
        }),
        knex('messages').insert({
          title: 'A Message From John',
          content: 'My name is John. This is a message. Hopefully it is good.',
          user_id: knex.select('id').from('users').where({ username: 'john' }),
          location: st.geomFromText('Point(-123.1217 49.283)', 4326)
        }),
        knex('messages').insert({
          title: 'A Message From Alex',
          content: 'My name is Alex. This is a message. Hopefully it is messageful.',
          user_id: knex.select('id').from('users').where({ username: 'alex' }),
          location: st.geomFromText('Point(-123.1237 49.2917)', 4326)
        })
      ]);
    });
};
