const knex = require('./db');

module.exports = class ModelBase {
  constructor(fields) {
    this.fields = fields;
  }

  validates() {
    return !!this.fields;
  }

  save(callback, fields) {
    if (!fields) {
      fields = this.fields;
    }

    if (this.validates()) {
      knex.insert(fields).into(this.table)
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      return false;
    }
  }

  static all(callback) {
    knex.select('*').from(this.table)
      .then((rows) => {
        callback(rows);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  static find(id, callback) {
    knex.first('*').from(this.table).where('id', id)
      .then((rows) => {
        callback(rows);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  static findBy(options, callback) {
    knex.select('*').from(this.table).where(options)
      .then((rows) => {
        callback(rows);
      })
      .catch((error) => {
        console.error(error);
      });
  }

}
