const app = require('../app');

const io = require('socket.io')(app.server);
io.on('connection', function(socket) {
  console.log('A user connected');
  socket.on('disconnect', function() {
    console.log('A user disconnected');
  });
});