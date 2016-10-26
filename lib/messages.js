const knex = require('./db');
const st = require('knex-postgis')(knex);

class Message extends require('./modelbase') {

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
    return knex
      .select(
        'messages.id',
        'messages.title',
        'messages.content',
        'messages.created_at',
        'messages.updated_at',
        knex.raw('ST_AsGeoJSON(location) AS coordinates'),
        'users.username'
      )
      .sum('read_messages.liked AS liked')
      .sum('read_messages.disliked AS disliked')
      .count('read_messages AS views')
      .from(this.table)
      .where(knex.raw(query))
      .join('users', 'messages.user_id', '=', 'users.id')
      .join('read_messages', 'messages.id', '=', 'read_messages.message_id')
      .groupBy('messages.id', 'users.id')
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

}

Message.table = 'messages';

module.exports = Message;


// Driver code
// Message.findLocation(1)
//   .then(rows => console.log(rows))
//   .catch(error => console.error(error));
//
// Message.findInRange('POINT(-123.1217 49.283)', 10)
//   .then(rows => console.log(rows))
//   .catch(error => console.error(error));
