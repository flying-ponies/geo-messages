const Message = require('../../lib/messages');

// TODO
// Get the position
// Decide a range

const position = 'Point(-123.1217 49.283)';
const range = 100000;

Message.findInRange(position, range)
  .then(rows => {
    console.log(rows);
  })
  .catch(error => {
    console.error(error);
  });
