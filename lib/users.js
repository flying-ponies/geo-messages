const knex = require('./db');
const bcrypt = require('bcryptjs');

class User extends require('./modelbase') {
  // TODO validates(), save(), constructor()
  constructor(fields) {
    if (!fields) {
      fields = {};
    }
    super(fields);
  }

  validates() {
    console.log('Validating in the child');
    this.errors = {};

    if (!this.fields.username) {
      this.errors.username = 'Username is required';
    }

    if (!this.fields.email) {
      this.errors.email = 'Email is required';
    }

    if (!this.fields.password) {
      this.errors.password = 'Password is required';
    }

    if (this.fields.password != this.fields.passwordConfirmation) {
      this.errors.passwordConfirmation = 'Password and password confirmation must match';
    }

    return !this.errors.keys;
  }

  save() {
    let fields = {};
    if (this.fields.hasOwnProperty('id')) {
      fields.id = this.fields.id;
    }
    fields.username = this.fields.username;
    fields.email = this.fields.email;
    fields.password_digest = this.fields.password;
    if (!fields.password_digest) {
      fields.password_digest = '';
    }

    // Generate encrypted password using bcrypt
    const salt = bcrypt.genSaltSync(10);
    fields.password_digest = bcrypt.hashSync(fields.password_digest, salt);

    return super.save(fields);
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

// let newUser = new User({
//   username: 'karl',
//   email: 'karl@email.com',
//   password: 'secret',
//   passwordConfirmation: 'secret'
// });

// newUser.save()
//   .then((something) => {
//     console.log('Saved to the DB', something);
//   })
//   .catch((error) => {
//     console.error(error);
//     console.log(newUser.errors);
//   });

// User.all()
//   .then(rows => console.log(rows))
//   .catch(error => console.error(error));

// User.find(1)
//   .then(rows => console.log(rows))
//   .catch(error => console.error(error));

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
