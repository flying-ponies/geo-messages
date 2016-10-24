const knex = require('./db');
const st = require('knex-postgis')(knex);

class Message extends require('./modelbase') {

  static findInRange(pos, range, callback) {
    const geomPos = st.geomFromText(pos, 4326);
    const query = `ST_DWithin(${geomPos}::geography, location, ${range})`;
    knex.select('*').from(this.table).where(knex.raw(query))
      .then(rows => callback(rows))
      .catch(error => console.error(error));
  }

}

Message.table = 'messages';

module.exports = Message;


// Driver code
// Message.findInRange('POINT(-123.1217 49.283)', 10, rows => console.log(rows));
