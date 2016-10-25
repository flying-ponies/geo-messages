const knex = require('./db');
const st = require('knex-postgis')(knex);

class Message extends require('./modelbase') {

  static findInRange(pos, range) {
    const geomPos = st.geomFromText(pos, 4326);
    const query = `ST_DWithin(${geomPos}::geography, location, ${range})`;
    return knex.select('*', knex.raw('ST_AsGeoJSON(location) AS position'))
      .from(this.table)
      .where(knex.raw(query))
      .join('users', 'users.id', '=', 'messages.user_id')
      .then((rows) => {
        var results = rows.reduce((prev, curr) => {
          curr.coordinates = {
            lat: JSON.parse(curr.position).coordinates[1],
            lng: JSON.parse(curr.position).coordinates[0]
          };
          delete curr.position;
          delete curr.location;
          delete curr.email;
          delete curr.password_digest;
          prev.push(curr);
          return prev;
        }, []);
        return new Promise((resolve, reject) => {
          resolve(results);
        });
      });
  }

}

Message.table = 'messages';

module.exports = Message;


// Driver code
// Message.findInRange('POINT(-123.1217 49.283)', 10)
//   .then(rows => console.log(rows))
//   .catch(error => console.error(error));
