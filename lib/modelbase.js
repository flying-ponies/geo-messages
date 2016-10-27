const knex = require('./db');

module.exports = class ModelBase {
  constructor(fields) {
    if (!fields) {
      fields = {};
    }
    this.fields = fields;
    this.errors = [];
  }

  save(fields) {
    if (!fields) {
      fields = this.fields;
    }
    return knex
      .insert(fields, '*')
      .into(this.constructor.table)
      .then((results) => {
        return new Promise((resolve, reject) => {
          this.fields = results[0];
          resolve();
        });
      });
  }

  destroy() {
    if (this.fields.hasOwnProperty('id')) {
      return knex(this.constructor.table).where('id', this.fields.id).del();
    } else {
      return new Promise((resolve, reject) => {
        reject(new Error('Destroy requires this.fields.id to be set'));
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
