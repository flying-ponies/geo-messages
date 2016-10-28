const app = require('../app');
const Message = require('../lib/messages');

const io = require('socket.io')(app.server);
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('get full messages', (coord) => {
    let pos = `Point(${coord.lng} ${coord.lat})`;
    Message.findInRange(pos, 10000)
      .then((rows) => {
        socket.emit('nearby full messages', rows);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  socket.on('post message', (messageObj) => {
    let newMessage = new Message(messageObj);
    newMessage.save()
      .then(() => {
        socket.emit('post message response', 'success');
        io.emit('new message');
      })
      .catch((error) => {
        console.error(error);
        socket.emit('post message response', 'fail');
      })
  });

  socket.on('disconnect', function() {
    console.log('A user disconnected');
  });
});
