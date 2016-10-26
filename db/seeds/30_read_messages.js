
exports.seed = function(knex, Promise) {
  const devinID = 1;
  const johnID = 2;
  const alexID = 3;

  // Deletes ALL existing entries
  return knex('read_messages').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('read_messages').insert({
          liked: 0,
          disliked: 1,
          user_id: devinID,
          message_id: 3
        }),
        knex('read_messages').insert({
          liked: 0,
          disliked: 1,
          user_id: devinID,
          message_id: 2
        }),
        knex('read_messages').insert({
          liked: 1,
          disliked: 0,
          user_id: johnID,
          message_id: 3
        }),
        knex('read_messages').insert({
          liked: 0,
          disliked: 0,
          user_id: johnID,
          message_id: 1
        }),
        knex('read_messages').insert({
          liked: 1,
          disliked: 0,
          user_id: alexID,
          message_id: 2
        })
      ]);
    });
};
