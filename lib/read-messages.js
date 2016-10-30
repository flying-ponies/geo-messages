const knex = require('./db');
const Message = require('./messages');
const User = require('./users');

class ReadMessage extends require('./modelbase') {

}

ReadMessage.table = 'read_messages';

module.exports = ReadMessage;
