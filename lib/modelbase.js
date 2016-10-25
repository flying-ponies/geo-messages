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

  static all() {
    return knex.select('*').from(this.table);
  }

  static find(id) {
    return knex.first('*').from(this.table).where('id', id);
  }

  static findBy(options) {
    return knex.select('*').from(this.table).where(options);
  }

}
