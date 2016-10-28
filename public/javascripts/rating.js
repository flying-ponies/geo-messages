function clickedThumbsUp( messageID ){
  socket.emit( "message liked", messageID );

}

function clickedThumbsDown( messageID ){
  socket.emit( "message disliked", messageID );

}