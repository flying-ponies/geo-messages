const knex = require('./db');

class User extends require('./modelbase') {
  // TODO validates(), save(), constructor()
  constructor(fields) {
    super(fields);
  }

  validates() {
    return false;
  }

  save(callback) {
    fields = {};
    fields.username = this.fields.username;
    fields.email = this.fields.email;

    // TODO bcrypt!
    fields.password_digest = this.fields.password;
  }

  readMessages() {
    return knex
      .select(
        'read_messages.liked',
        'read_messages.disliked',
        'read_messages.created_at AS read_at',
        'messages.title',
        'messages.content',
        'messages.created_at',
        'users.username'
      )
      .from('read_messages')
      .join('messages', 'read_messages.message_id', '=', 'messages.id')
      .join('users', 'messages.user_id', '=', 'users.id')
      .where('read_messages.user_id', '=', this.fields.id);
  }
}

User.table = 'users';

module.exports = User;

// Driver code!

// User.all()
//   .then(rows => console.log(rows))
//   .catch(error => console.error(error));
//
// User.find(1)
//   .then(rows => console.log(rows))
//   .catch(error => console.error(error));
//
// User.findBy({username: 'alex'})
//   .then(rows => console.log(rows))
//   .catch(error => console.error(error));

// let newUser = new User({
//   id: 2,
//   username: '',
//   email: '',
//   password: '',
//   passwordConfirmation: '',
// });

// User.findBy({username: 'devin'})
//   .then((rows) => {
//     let devin = new User(rows[0]);
//     devin.readMessages()
//       .then((rows) => {
//         console.log(rows);
//       })
//       .catch((error) => {
//         console.error(error)
//       });
//   });

// newUser.readMessages().then(rows => console.log(rows)).catch(error => console.error(error));
