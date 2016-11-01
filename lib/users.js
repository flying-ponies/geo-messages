const knex = require('./db');
const bcrypt = require('bcryptjs');
const Message = require('./messages');

class User extends require('./modelbase') {

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
          return super.save(fields);
        })
        .then((values) => {
          resolve(values);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getReadMessage(messageID) {
    return knex.first('*')
      .from('read_messages')
      .where('read_messages.user_id', '=', this.fields.id)
      .andWhere('read_messages.message_id', '=', messageID)
      .then((message) => {
        return new Promise((resolve, reject) => {
          if (message) {
            resolve(message);
          } else {
            reject(new Error('Message does not exist or has not been read by user'));
          }
        })
      });
  }

  updateLikes(messageID, like=0, dislike=0) {
    like = like ? 1 : 0;
    dislike = dislike ? 1 : 0;

    if (like !== 0 && dislike !== 0) {
      return new Promise((resolve, reject) => {
        reject(new Error('like or dislike must equal 0 (or a falsey value)'));
      })
    }

    var previous;
    var current = {
      liked: like,
      disliked: dislike
    };

    return this.getReadMessage(messageID)
      .then((message) => {
        previous = {
          liked: message.liked,
          disliked: message.disliked
        };

        return knex('read_messages')
          .update({
            liked: like,
            disliked: dislike
          }, '*')
          .where('message_id', messageID)
          .andWhere('user_id', this.fields.id)
          .then(() => {
            return new Promise((resolve, reject) => {
              resolve({
                previous: previous,
                current: current
              });
            });
          });
      });
  }

  likeMessage(messageID) {
    return this.updateLikes(messageID, 1);
  }

  dislikeMessage(messageID) {
    return this.updateLikes(messageID, 0, 1);
  }

  addReadMessage(messageID) {
    return this.getReadMessage(messageID)
      .catch((error) => {
        return knex.insert({
          message_id: messageID,
          user_id: this.fields.id
        }).into('read_messages', '*');
      });
  }

  // Retrieve the messages this instance of user has read
  readMessages(page) {
    if (!this.fields.id) {
      return new Promise((resolve, reject) => {
        reject(new Error('id must be defined'));
      });
    }
    var messageIdSelector = knex.select('message_id').from('read_messages').where('user_id', this.fields.id);
    const query = `messages.id IN (${messageIdSelector}) AND messages.user_id != ${this.fields.id}`;
    return Message.getMessagesWithPages(query, page);
  }

  getUserMessages(page) {
    if (!this.fields.id) {
      return new Promise((resolve, reject) => {
        reject(new Error('id must be defined'));
      });
    }
    const query = `messages.user_id = ${this.fields.id}`;
    return Message.getMessagesWithPages(query, page);
  }

  static search(username) {
    return knex
      .select('username')
      .from('users')
      .where('username', 'like', `${username}%`)
      .then((rows) => {
        return new Promise((resolve, reject) => {
          resolve(rows);
        });
      });
  }

  static authenticateUser(email, password) {
    return knex.first('id', 'username', 'email', 'password_digest')
      .from('users')
      .where(knex.raw('LOWER(email)'), '=', email.toLowerCase())
      .then((row) => {
        if (row && bcrypt.compareSync(password, row.password_digest)) {
          return new Promise((resolve, reject) => {
            resolve({
              id: row.id,
              username: row.username,
              email: row.email
            });
          });
        } else {
          return new Promise((resolve, reject) => {
            reject(new Error('Invalid email or password'));
          });
        }
      });
  }
}

User.table = 'users';

module.exports = User;

// Driver code!

// User.search('yoyoyo').then(rows => console.log(rows));

// User.authenticateUser('devin.gir@gmail.com', 'secrets')
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// let newUser = new User({
//   username: 'Lim',
//   email: 'lim@email.com',
//   password: 'secret123',
//   passwordConfirmation: 'secret123'
// });

// newUser.save()
//   .then(() => {
//     console.log('Saved to the DB');
//     return newUser.destroy();
//   })
//   .then((results) => {
//     console.log('Destroyed', results);
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

// Get all read messages from a specific user
// User.findBy({username: 'devin'})
//   .then((rows) => {
//     let devin = new User(rows[0]);
//     return devin.readMessages()
//   })
//   .then((rows) => {
//     console.log(rows);
//   })
//   .catch((error) => {
//     console.error(error)
//   });

// Add a read message to a user's read messages
// User.findBy({username: 'devin'})
//   .then((rows) => {
//     let devin = new User(rows[0]);
//     return devin.addReadMessage(2)
//   })
//   .then((rows) => {
//     console.log('Added read message', rows);
//   })
//   .catch((error) => {
//     console.error(error)
//   });

// Like or dislike a message
// let devin;
// User.findBy({username: 'devin'})
//   .then((rows) => {
//     devin = new User(rows[0]);
//     return devin.likeMessage(2);
//   })
//   .then((rows) => {
//     console.log('Liked message', rows);
//     return devin.dislikeMessage(2);
//   })
//   .then((rows) => {
//     console.log('Disliked message', rows);
//     return devin.updateLikes(2);
//   })
//   .then((rows) => {
//     console.log('Undisliked message', rows);
//   })
//   .catch((error) => {
//     console.error(error)
//   });

// Get user's messages
// User.findBy({username: 'devin'})
//   .then((rows) => {
//     let devin = new User(rows[0]);
//     return devin.getUserMessages()
//   })
//   .then((rows) => {
//     console.log('Devin\'s messages:', rows);
//   })
//   .catch((error) => {
//     console.error(error)
//   });

// newUser.readMessages().then(rows => console.log(rows)).catch(error => console.error(error));
