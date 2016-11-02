const knex = require('./db');
const st = require('knex-postgis')(knex);
const messagePerPage = 5;

class Message extends require('./modelbase') {

  validates() {
    this.errors = [];

    if (!this.fields.title) {
      this.errors.push('Title is required');
    }

    if (!this.fields.content) {
      this.errors.push('Content is required');
    }

    if (!this.fields.user_id) {
      this.errors.push('User_id is required');
    }

    if (!this.fields.location) {
      this.errors.push('Location is required');
    }

    if (this.errors.length) {
      return new Promise((resolve, reject) => {
        reject(new Error('Invalid input'));
      });
    }

    return new Promise((resolve, reject) => {
      knex.first('*').from('users').where('id', this.fields.user_id)
        .then((row) => {
          if (row) {
            resolve();
          } else {
            reject(new Error('Invalid user ID.'));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  save() {
    let fields = {};
    if (this.fields.hasOwnProperty('location_name')) {
      fields.location_name = this.fields.location_name;
    };
    if (this.fields.hasOwnProperty('private')) {
      fields.private = this.fields.private;
    };
    fields.title = this.fields.title;
    fields.content = this.fields.content;
    fields.user_id = this.fields.user_id;
    fields.location = st.geomFromText(this.fields.location, 4326);

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

  update(fields) {
    // For now only edit content can be updated
    fields = {
      content: fields.content
    };
    return knex('messages')
      .where('id', this.fields.id)
      .update(fields);
  }

  addRecipients(recipients) {
    if (!this.fields.id) {
      return new Promise((resolve, reject) => {
        reject(new Error('Fields.id must be set'));
      });
    }

    if (!recipients || !recipients.length) {
      return new Promise((resolve, reject) => {
        reject(new Error('Recipients must be passed as an argument'));
      });
    }

     if (!Array.isArray(recipients)) {
       recipients = [recipients];
     }

     // Remove white space and convert to lowercase
     recipients = recipients.map((recipient) => {
       return recipient.trim().toLowerCase();
     });

     // Filter out empty inputs and duplicates
     recipients = function (a) {
       var seen = {};
       return a.filter(function(item) {
         if (a === '') {
           return false;
         }
         return seen.hasOwnProperty(item) ? false : (seen[item] = true);
       });
     }(recipients);

     return Message.find(this.fields.id)
      .then((row) => {
        if (!row.private) {
          return new Promise ((resolve, reject) => {
            reject(new Error('Cannot add recipients to public messages'));
          });
        }

        let promises = recipients.map((recipient) => {
          let recipientID;
          return knex.first('id')
          .from('users')
          .where(knex.raw('LOWER(username)'), recipient)
          .orWhere(knex.raw('LOWER(email)'), recipient)
          .then((row) => {
            if (row) {
              recipientID = row.id;
              return knex
                .first('*')
                .from('message_recipients')
                .where('message_id', this.fields.id)
                .andWhere('user_id', recipientID)
                .then((row) => {
                  if (row) {
                    return new Promise(resolve => resolve());
                  } else {
                    return knex.insert({
                      message_id: this.fields.id,
                      user_id: recipientID
                    }).into('message_recipients');
                  }
                })
            } else {
              return new Promise(resolve => resolve());
            }
          });
        });

        return Promise.all(promises);
      });
  }

  static findLocation(id) {
    return knex
      .select(knex.raw('ST_AsGeoJSON(location) AS coordinates'))
      .from(this.table)
      .where('id', id)
      .then((rows) => {
        var results = rows.map((row) => {
          row.coordinates = {
            lat: JSON.parse(row.coordinates).coordinates[1],
            lng: JSON.parse(row.coordinates).coordinates[0]
          };
          return row;
        });
        return new Promise((resolve, reject) => {
          resolve(results);
        });
      });
  }

  static findInRange(pos, range) {
    const geomPos = st.geomFromText(pos, 4326);
    const query = `ST_DWithin(${geomPos}::geography, location, ${range}) AND messages.private != TRUE`;
    return this.getMessages(query);
  }

  static getMessages(query) {
    return knex
      .select(
        'messages.id',
        'messages.title',
        'messages.content',
        'messages.created_at',
        'messages.updated_at',
        'messages.location_name',
        knex.raw('ST_AsGeoJSON(location) AS coordinates'),
        'users.username'
      )
      .sum('read_messages.liked AS likes')
      .sum('read_messages.disliked AS dislikes')
      .count('read_messages AS views')
      .from(this.table)
      .where(knex.raw(query))
      .leftJoin('users', 'messages.user_id', '=', 'users.id')
      .leftJoin('read_messages', 'messages.id', '=', 'read_messages.message_id')
      .groupBy('messages.id', 'users.id')
      .orderBy('created_at', 'desc')
      .then((rows) => {
        var results = rows.map((row) => {
          row.coordinates = {
            lat: JSON.parse(row.coordinates).coordinates[1],
            lng: JSON.parse(row.coordinates).coordinates[0]
          };
          return row;
        });
        return new Promise((resolve, reject) => {
          resolve(results);
        });
      });
  }

  static getMessagesWithPages(query, page) {
    var offset = (page - 1) * messagePerPage;
    return Promise.all([
      knex('messages').count(this.table)
        .where(knex.raw(query))
        .leftJoin('users', 'messages.user_id', '=', 'users.id'),
      knex
        .select(
          'messages.id',
          'messages.title',
          'messages.content',
          'messages.created_at',
          'messages.updated_at',
          'messages.location_name',
          knex.raw('ST_AsGeoJSON(location) AS coordinates'),
          'users.username'
        )
        .sum('read_messages.liked AS likes')
        .sum('read_messages.disliked AS dislikes')
        .count('read_messages AS views')
        .from(this.table)
        .where(knex.raw(query))
        .leftJoin('users', 'messages.user_id', '=', 'users.id')
        .leftJoin('read_messages', 'messages.id', '=', 'read_messages.message_id')
        .groupBy('messages.id', 'users.id')
        .orderBy('created_at', 'desc')
        .limit(messagePerPage)
        .offset(offset)
      ]).then((rows) => {
        var totalPages = Math.ceil(rows[0][0].count/messagePerPage);
        var messages = rows[1].map((row) => {
          row.coordinates = {
            lat: JSON.parse(row.coordinates).coordinates[1],
            lng: JSON.parse(row.coordinates).coordinates[0]
          };
          return row;
        });
        return new Promise((resolve, reject) => {
          resolve({messages: messages, totalPages: totalPages});
        });
      });
  }

  static findById(id) {
    const query = `messages.id = ${id}`;
    return this.getMessages(query);
  }

}

Message.table = 'messages';

module.exports = Message;


// Driver code

// knex.select(knex.raw("ST_GeomFromText('POINT(-124.05 49.282)', 4326)"))
//   .then((geom) => {
//     console.log(geom);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// let newPrivateMessage = new Message({
//   title: 'A Private Message',
//   content: 'This message is private. It can only be read by its intended recipients',
//   user_id: 3,
//   location: 'POINT(-123.1227 49.385)',
//   location_name: 'Secrets',
//   private: true
// });
//
// newPrivateMessage.save().then((results) => {
//   console.log('Saved new message:', results);
//   return newPrivateMessage.addRecipients(['john']);
// })
// .then((results) => {
//   console.log('Added Recipients:', results);
// })
// .catch((error) => {
//   console.error(error);
// });

// newMessage = new Message({
//   title: 'A Sampling of Moby Dick',
//   content: `<p>"Aye, among some of us old sailor chaps, he goes by that name. Ye hav'n't seen him yet, have ye?"</p>
//   <p>"No, we hav'n't. He's sick they say, but is getting better, and will be all right again before long."</p>
//   <p>"All right again before long!" laughed the stranger, with a solemnly derisive sort of laugh. "Look ye; when Captain Ahab is all right, then this left arm of mine will be all right; not before."</p>
//   <p>"What do you know about him?"</p>
//   <p>"What did they TELL you about him? Say that!"</p>
//   <p>"They didn't tell much of anything about him; only I've heard that he's a good whale-hunter, and a good captain to his crew."</p>`,
//   user_id: 2,
//   location: 'POINT(-123.1227 49.385)'
// });

// newMessage.save()
  // .then(() => {
    // console.log('Saved to the DB');
    // return newMessage.destroy();
  // })
  // .then((results) => {
  //   console.log('Destroyed', results);
  // })
  // .catch((error) => {
  //   console.error(error);
  //   console.log(newMessage.errors);
  // });

// Message.findLocation(1)
//   .then(rows => console.log(rows))
//   .catch(error => console.error(error));
//
// Message.findInRange('POINT(-124.05 49.282)', 100)
//   .then(rows => console.log('Rows:', rows))
//   .catch(error => console.error(error));

// var temp = 'SELECT message_id FROM read_messages WHERE user_id = 14';
// Message.getMessages(`messages.id IN (${temp})`)
//   .then(rows => console.log('Rows:', rows))
//   .catch(error => console.error(error

// Message.getMessages(`messages.user_id = 13`, 2)
//   .then(rows => {
//     // console.log(rows);
//     console.log(rows.totalPages);
//     rows.results.map((row) => {
//       console.log(row.title);
//     })
//   })
//   .catch(error => console.error(error));
