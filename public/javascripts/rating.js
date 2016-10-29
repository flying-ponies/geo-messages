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

  socket.on('message rating updated', function(updateThumbs){
    var messages = $("message-container");
    messages.forEach( message ){
      if( updateThumbs.messageId === message.find("span.glyphicon.glyphicon-thumbs-up").dataset.messageId ){
        message.find("span.likes").val( updateThumbs.up );
        message.find("span.dislikes").val( updateThumbs.down );
      }
    }
  });
}


$(document).ready( function() {
  registerRatingEventHooks();
})
