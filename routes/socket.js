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

  socket.on('message viewed', (messageId) => {
    console.log('message viewed: message ID: ', messageId);

  });

  socket.on('message liked', (messageId) => {
    console.log('message liked: message ID: ', messageId);

    let user = new User({user_id: 1});
    user.likeMessage( messageId );
    .then((rows) => {
      console.log('Liked message', rows);
    })
    .catch((error) => {
      console.error(error)
    });
  });

  socket.on('message disliked', (messageId) => {
    console.log('message disliked: message ID: ', messageId);

    let user = new User({user_id: 1});
    user.dislikeMessage( messageId );
    .then((rows) => {
      console.log('Disliked message', rows);
    })
    .catch((error) => {
      console.error(error)
    });
  });

  socket.on('disconnect', function() {
    console.log('A user disconnected');
  });
});
