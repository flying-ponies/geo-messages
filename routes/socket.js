const app = require('../app');
const Message = require('../lib/messages');
const User = require('../lib/users');

const io = require('socket.io')(app.server);

const sharedsession = require("express-socket.io-session");

const session = require('../lib/session');

io.use(sharedsession(session, {
    autoSave:true
  })
);

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
    if (socket.handshake.session.currentUser) {
      messageObj.user_id = socket.handshake.session.currentUser.id;
    } else {
      messageObj.user_id = null;
    }
    let newMessage = new Message(messageObj);
    newMessage.save()
      .then(() => {
        socket.broadcast.emit('new message');
        return Message.findById(newMessage.fields.id)
      })
      .then((rows) => {
        socket.emit('post message response', rows[0]);
      })
      .catch((error) => {
        console.error(error);
        socket.emit('post message response', null);
      })
  });

  socket.on('message viewed', (messageId) => {
    console.log('message viewed: message ID: ', messageId);

  });

  socket.on('message liked', (messageId) => {
    console.log('message liked: message ID: ', messageId);

    let user = new User( socket.handshake.session.currentUser );
    user.likeMessage( messageId )
      .then((retObject) => {
        console.log('Liked message', retObject);
        if( retObject.current.liked > retObject.previous.liked ){
          if( retObject.current.disliked < retObject.previous.disliked ){
            socket.emit('message liked success', messageId);
          }
          else {
            socket.emit('message liked new success', messageId);
          }
        }
      })
      .catch((error) => {
        console.error(error)
      });
  });

  socket.on('message disliked', (messageId) => {
    console.log('message disliked: message ID: ', messageId);

    let user = new User( socket.handshake.session.currentUser );
    user.dislikeMessage( messageId )
      .then((retObject) => {
        console.log('Disliked message', retObject);
        if( retObject.current.disliked > retObject.previous.disliked ){
          if( retObject.current.liked < retObject.previous.liked ){
            socket.emit('message disliked success', messageId);
          }
          else {
            socket.emit('message disliked new success', messageId);
          }
        }
      })
      .catch((error) => {
        console.error(error)
      });
  });

  socket.on('disconnect', function() {
    console.log('A user disconnected');
  });
});
