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
}


$(document).ready( function() {
  registerRatingEventHooks();
})
