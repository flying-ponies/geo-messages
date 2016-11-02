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
    if (!socket.handshake.session.currentUser) {
      return null;
    }

    let currentUser = new User(socket.handshake.session.currentUser);
    let pos = `Point(${coord.lng} ${coord.lat})`;
    currentUser.findInRange(pos, 10000)
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
        console.log('New Message:', newMessage);
        if (newMessage.fields.private) {
          console.log('Private Message Made');
          if (!Array.isArray(messageObj.recipients)) {
            messageObj.recipients = [messageObj.recipients];
          }

          messageObj.recipients.push(socket.handshake.session.currentUser.email);
          console.log('Adding recipients:', messageObj.recipients);
          return newMessage.addRecipients(messageObj.recipients);
        } else {
          console.log('Public message made');
          return new Promise((resolve) => {
            resolve();
          });
        }
      })
      .then(() => {
        let readMessageObj = {
          user_id: socket.handshake.session.currentUser.id,
          message_id: newMessage.fields.id
        };
        let readMessage = new ReadMessage(readMessageObj);
        return readMessage.save();
      }).then(() => {
        io.emit('new message');
        socket.emit('post message response', null);
        console.log('Message viewed')
      })
      .catch((error) => {
        console.error(error);
        socket.emit('post message response', newMessage.errors);
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
        } else {
          return user.updateLikes( messageId ).then(() => {
            socket.emit('message unliked success', messageId);
          });
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
        } else {
          return user.updateLikes( messageId ).then(() => {
            socket.emit('message undisliked success', messageId);
          });
        }
      })
      .catch((error) => {
        console.error(error)
      });
  });

  socket.on('retrieve your messages', (page) => {
    let newUser = new User( socket.handshake.session.currentUser );

    newUser.getUserMessages(page)
      .then((results) => {
        socket.emit('your messages', results);
      });
  });

  socket.on('retrieve read messages', (page) => {
    let newUser = new User( socket.handshake.session.currentUser );

    newUser.readMessages(page)
      .then((results) => {
        socket.emit('read messages', results);
      });
  });

  socket.on('update message content', (data) => {
    if (!socket.handshake.session.currentUser) {
      return;
    }

    Message.find(data.id).then((row) => {
      let msg = new Message(row);
      if (msg.fields.user_id === socket.handshake.session.currentUser.id) {
        msg.update({content: data.content})
        .then(() => {
          socket.emit('update message content response', null);
        })
        .catch((error) => {
          socket.emit('update message content response', 'Could not update');
          console.error(error);
        });
      } else {
        socket.emit('update message content response', 'Could not update');
      }
    });
  });

  socket.on('delete message', (messageID) => {
    if (!socket.handshake.session.currentUser) {
      return;
    }

    Message.find(messageID).then((row) => {
      let msg = new Message(row);
      if (msg.fields.user_id === socket.handshake.session.currentUser.id) {
        msg.destroy()
        .then(() => {
          socket.emit('delete message response', null);
        })
        .catch((error) => {
          socket.emit('delete message response', 'Could not delete');
          console.error(error);
        });
      } else {
        socket.emit('delete message response', 'Could not delete');
      }
    });
  });

  socket.on('disconnect', function() {
    console.log('A user disconnected');
  });

  socket.on('clumped messages', (messageIds) => {

    var query = ' "messages"."id" in (';
    for( var messageId, i=0; i < messageIds.length; i++ ){
      messageId = messageIds[i];

      console.log("Clumped MessageIDs: ", messageId);

      if(i != messageIds.length - 1){
        query = query + String( messageId ) + ", ";
      }
      else {
        query = query + String( messageId ) + ")";
      }

    }
    Message.getMessages( query )
      .then((rows) => {
        console.log( "rows", rows );
        socket.emit( 'clumped messages returned', rows );
      })
      .catch((error) => {
        console.error("query:", query);
        console.error(error);

      });
  });
});
