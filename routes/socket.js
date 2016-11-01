const app = require('../app');
const Message = require('../lib/messages');
const User = require('../lib/users');
const ReadMessage = require('../lib/read-messages');

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
        io.emit('new message');
        return Message.findById(newMessage.fields.id)
      })
      .then((rows) => {
        let readMessageObj = {
          user_id: socket.handshake.session.currentUser.id,
          message_id: rows[0].id
        };
        let readMessage = new ReadMessage( readMessageObj );
        return readMessage.save();
      }).then(() => {
        socket.emit('post message response', true);
        console.log('Message viewed')
      })
      .catch((error) => {
        console.error(error);
        socket.emit('post message response', null);
      })
  });

  socket.on('message viewed', (messageId) => {
    console.log('message viewed: message ID: ', messageId);
    let readMessageObj = {
      user_id: socket.handshake.session.currentUser.id,
      message_id: messageId
    };
    let readMessage = new ReadMessage( readMessageObj );
    readMessage.save()
      .then((res) => {
        return Message.findById(messageId);
      }).then((rows) => {
        socket.emit('message viewed response', rows[0]);
      })
      .catch((error) => {
        if(readMessage.errors[0] === 'message has be viewed before' && readMessage.errors.length === 1) {
          Message.findById(messageId).then((rows) => {
            socket.emit('message viewed response', rows[0]);
          });
        } else {
          console.error(error)
        }
      });

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

  socket.on('retrieve your messages', () => {
    let newUser = new User( socket.handshake.session.currentUser );

    newUser.getUserMessages()
      .then((messages) => {
        socket.emit('your messages', messages);
      });
  });

  socket.on('retrieve read messages', () => {
    let newUser = new User( socket.handshake.session.currentUser );

    newUser.readMessages()
      .then((messages) => {
        socket.emit('read messages', messages);
      });
  });

  socket.on('disconnect', function() {
    console.log('A user disconnected');
  });
});
