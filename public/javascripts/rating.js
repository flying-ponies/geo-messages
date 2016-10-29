function registerRatingEventHooks(){
  console.log( "Registering Event Handlers" );

  $("span.glyphicon.glyphicon-thumbs-up").click( clickedThumbsUp );
  function clickedThumbsUp(){
    console.log( "Thumbs up!" );
    socket.emit( "message liked", this.dataset.messageId );
  }

  $("span.glyphicon.glyphicon-thumbs-down").click( clickedThumbsDown );
  function clickedThumbsDown( messageID ){
    console.log( "Thumbs down!" );
    socket.emit( "message disliked", this.dataset.messageId );

  }

  socket.on('message liked', function(){
    var messages = $("message-container");
    messages.forEach( message ){
      if( updateThumbs.messageId === message.find("span.glyphicon.glyphicon-thumbs-up").dataset.messageId ){
        var likes = message.find("span.likes");
        var dislikes = message.find("span.dislikes");
        likes.val( likes.val() + 1 );
        dislikes.val( dislikes.val() - 1 );
      }
    }
  });

  socket.on('message disliked', function(){
    var messages = $("message-container");
    messages.forEach( message ){
      if( updateThumbs.messageId === message.find("span.glyphicon.glyphicon-thumbs-up").dataset.messageId ){
        var likes = message.find("span.likes");
        var dislikes = message.find("span.dislikes");
        likes.val( likes.val() - 1 );
        dislikes.val( dislikes.val() + 1 );
      }
    }
  });

  socket.on('message liked new', function(){
    var messages = $("message-container");
    messages.forEach( message ){
      if( updateThumbs.messageId === message.find("span.glyphicon.glyphicon-thumbs-up").dataset.messageId ){
        var likes = message.find("span.likes");
        likes.val( likes.val() + 1 );
      }
    }
  });

  socket.on('message disliked new', function(){
    var messages = $("message-container");
    messages.forEach( message ){
      if( updateThumbs.messageId === message.find("span.glyphicon.glyphicon-thumbs-up").dataset.messageId ){
        var dislikes = message.find("span.dislikes");
        dislikes.val( dislikes.val() + 1 );
      }
    }
  });

}


$(document).ready( function() {
  registerRatingEventHooks();
})
