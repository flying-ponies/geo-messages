const knex = require('./db');

class ReadMessage extends require('./modelbase') {
  validates() {
    this.errors = [];

    if (!this.fields.user_id) {
      this.errors.push('User_id is required');
    }

    if (!this.fields.message_id) {
      this.errors.push('Message_id is required');
    }

    return new Promise((resolve, reject) => {
      knex.select('*').from('read_messages').where('user_id', this.fields.user_id)
        .where('message_id', this.fields.message_id)
        .then((rows) => {
          if (rows.length === 0 ) {
            resolve();
          } else {
            this.errors.push('message has be viewed before');
            reject(new Error('message has be viewed before'));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  // Save this read message instance to the database
  save() {
    let fields = {};
    if (this.fields.hasOwnProperty('id')) {
      fields.id = this.fields.id;
    }
    fields.user_id = this.fields.user_id;
    fields.message_id = this.fields.message_id;

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

}

ReadMessage.table = 'read_messages';

module.exports = ReadMessage;

// Driver code!

// knex.select('*').from('read_messages').where('user_id', 2)
//   .where('message_id', 2)
//   .then((row) => {console.log(row);});
