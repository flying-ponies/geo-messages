
exports.seed = function(knex, Promise) {
  const st = require('knex-postgis')(knex);

  // Deletes ALL existing entries
  return knex('messages').del()
    .then(function() {
      return knex.select('id').from('users');
    })
    .then(function (rows) {
      return Promise.all([
        // Inserts seed entries
        knex('messages').insert({
          id: 1,
          title: 'A Message From Devin',
          content: 'My name is Devin. This is a message. Hopefully it is in Vancouver.',
          user_id: rows[0].id,
          location: st.geomFromText('Point(-123.1207 49.2827)', 4326)
        }),
        knex('messages').insert({
          id: 2,
          title: 'A Message From John',
          content: 'My name is John. This is a message. Hopefully it is good.',
          user_id: rows[1].id,
          location: st.geomFromText('Point(-123.1217 49.283)', 4326)
        }),
        knex('messages').insert({
          id: 3,
          title: 'A Message From Alex',
          content: 'My name is Alex. This is a message. Hopefully it is messageful.',
          user_id: rows[2].id,
          location: st.geomFromText('Point(-123.1237 49.2917)', 4326)
        }),
        knex('messages').insert({
          id: 4,
          title: 'A Message From the Ocean',
          content: 'This message is in the ocean. This would be hard to find.',
          user_id: rows[2].id,
          location: st.geomFromText('Point(-124.050 49.2820)', 4326)
        })
      ]);
    });
};
