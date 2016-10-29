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
        socket.broadcast.emit('new message');
        Message.findById(newMessage.fields.id)
          .then((rows) => {
            socket.emit('post message response', rows[0]);
          });
      })
      .catch((error) => {
        console.error(error);
        socket.emit('post message response', null);
      })
  });

  socket.on('message viewed', (messageId) => {
    console.log('message viewed: message ID: ', messageId);
    // MAKE CHANGES TO DB
  });

  socket.on('message liked', (messageId) => {
    console.log('message liked: message ID: ', messageId);
    // MAKE CHANGES TO DB
  });

  socket.on('message disliked', (messageId) => {
    console.log('message disliked: message ID: ', messageId);
    // MAKE CHANGES TO DB
  });

  socket.on('disconnect', function() {
    console.log('A user disconnected');
  });
});
