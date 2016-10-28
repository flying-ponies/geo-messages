const session = require('express-session')({
  secret: 'th3 qu1ck br0wn f0x jump3d ov3r the l@zy d0g',
  resave: true,
  saveUninitialized: true
});

module.exports = session;
