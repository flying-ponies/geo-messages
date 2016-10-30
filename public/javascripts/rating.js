function registerRatingEventHooks(){
  console.log( "Registering Event Handlers" );

  $("span.glyphicon.glyphicon-thumbs-up").click( clickedThumbsUp );
  function clickedThumbsUp(){
    socket.emit( "message liked", this.dataset.messageId );
  }

  $("span.glyphicon.glyphicon-thumbs-down").click( clickedThumbsDown );
  function clickedThumbsDown( messageID ){
    socket.emit( "message disliked", this.dataset.messageId );

  }

  socket.on('message liked success', function( messageId ){
    var messages = $("div.message-container");
    messages.each( function( index ){
      if( Number( messageId ) ===
          Number( $( this ).find("span.glyphicon.glyphicon-thumbs-up").data().messageId )){
        var likes = $( this ).find("span.like");
        var dislikes = $( this ).find("span.dislike");
        likes.text( Number(likes.text()) + 1 );
        dislikes.text( Number(dislikes.text()) - 1 );
      }
    });
  });

  socket.on('message disliked success', function( messageId ){
    var messages = $("div.message-container");
    messages.each( function( index ){
      if( Number( messageId ) ===
          Number( $( this ).find("span.glyphicon.glyphicon-thumbs-up").data().messageId )){
        var likes = $( this ).find("span.like");
        var dislikes = $( this ).find("span.dislike");
        likes.text( Number(likes.text()) - 1 );
        dislikes.text( Number(dislikes.text()) + 1 );
      }
    });
  });

  socket.on('message liked new success', function( messageId ){
    var messages = $("div.message-container");
    messages.each( function( index ){
      if( Number( messageId ) ===
          Number( $( this ).find("span.glyphicon.glyphicon-thumbs-up").data().messageId )){
        var likes = $( this ).find("span.like");
        likes.text( Number(likes.text()) + 1 );
      }
    });
  });

  socket.on('message disliked new success', function( messageId ){
    var messages = $("div.message-container");
    messages.each( function( index ){
      if( Number( messageId ) ===
          Number( $( this ).find("span.glyphicon.glyphicon-thumbs-up").data().messageId )){
        var dislikes = $( this ).find("span.dislike");
        dislikes.text( Number(dislikes.text()) + 1 );
      }
    });
  });
}


$(document).ready( function() {
  registerRatingEventHooks();
})
