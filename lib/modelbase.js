const knex = require('./db');

module.exports = class ModelBase {
  constructor(fields) {
    this.fields = fields;
    this.errors = [];
  }

  save(fields) {
    if (!fields) {
      fields = this.fields;
    }
    return knex.insert(fields, '*').into(this.constructor.table);
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
