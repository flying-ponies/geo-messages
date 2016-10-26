const knex = require('./db');

module.exports = class ModelBase {
  constructor(fields) {
    this.fields = fields;
    this.errors = {};
  }

  validates() {
    return !!this.fields;
  }

  save(fields) {
    if (!fields) {
      fields = this.fields;
    }

    if (this.validates()) {
      return knex.insert(fields, '*').into(this.constructor.table);
    } else {
      return new Promise((resolve, reject) => {
        reject(new Error('Invalid fields'));
      });
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
