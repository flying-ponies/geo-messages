const app = require('../app');
const Message = require('../lib/messages');

const io = require('socket.io')(app.server);
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('update position', (coord) => {
    let pos = `Point(${coord.lng} ${coord.lat})`;
    Message.findInRange(pos, 1000)
      .then((rows) => {
        socket.emit('nearby messages', rows);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  socket.on('post message', (messageObj) => {
    console.log(messageObj);
    // INSERT TO DB
    // SUCCESS
      socket.emit("post message response", "success");
      // BROADCAST TO USERS IN RANGE
    // FAIL
      // socket.emit("post mesage response", "fail")
  });

  socket.on('disconnect', function() {
    console.log('A user disconnected');
  });
});
