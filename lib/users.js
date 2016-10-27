const knex = require('./db');
const bcrypt = require('bcryptjs');

class User extends require('./modelbase') {
  constructor(fields) {
    if (!fields) {
      fields = {};
    }
    super(fields);
  }

  // Validate that the input fields for this user instance are valid for a
  // new user
  validates() {
    this.errors = [];

    if (!this.fields.username) {
      this.errors.push('Username is required');
    }

    if (!this.fields.email) {
      this.errors.push('Email is required');
    }

    if (!this.fields.password) {
      this.errors.push('Password is required');
    } else if (this.fields.password.length < 8) {
      this.errors.push('Password must be at least 8 characters');
    }

    if (this.fields.password !== this.fields.passwordConfirmation) {
      this.errors.push('Password and confirmation must match');
    }

    if (this.errors.length) {
      return new Promise((resolve, reject) => {
        reject(new Error('Invalid input'));
      });
    }

    return new Promise((resolve, reject) => {
      knex.first('username', 'email')
      .from('users')
      .where(knex.raw('LOWER(username)'), '=', this.fields.username.toLowerCase())
      .orWhere(knex.raw('LOWER(email)'), '=', this.fields.email.toLowerCase())
      .then((row) => {
        if (row) {
          if (row.username.toLowerCase() == this.fields.username.toLowerCase()) {
            this.errors.push('Username already in use');
          }

          if (row.email.toLowerCase() == this.fields.email.toLowerCase()) {
            this.errors.push('Email already in use');
          }
          reject(new Error('Username or Email already exists.'));
        } else {
          resolve();
        }
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

  // Save this user instance to the database
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

    return new Promise((resolve, reject) => {
      this.validates()
        .then(() => {
          super.save(fields)
            .then((values) => {
              resolve(values);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // Retrieve the messages this instance of user has read
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
//   username: 'Karl',
//   email: 'karl@EMail.com',
//   password: 'secret123',
//   passwordConfirmation: 'secret123'
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
