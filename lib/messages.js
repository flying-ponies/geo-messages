const knex = require('./db');
const st = require('knex-postgis')(knex);

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
    const query = `ST_DWithin(${geomPos}::geography, location, ${range})`;
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

// var temp = 'SELECT message_id FROM read_messages WHERE user_id = 1';
// Message.getMessages(`messages.id IN (${temp})`)
//   .then(rows => console.log('Rows:', rows))
//   .catch(error => console.error(error));
