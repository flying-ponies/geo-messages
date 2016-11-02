function clickedThumbsUp(){
  console.log( "Thumbs up! id:", this.dataset.messageId );
  socket.emit( "message liked", this.dataset.messageId );
}

function clickedThumbsDown(){
  console.log( "Thumbs down! id:", this.dataset.messageId );
  socket.emit( "message disliked", this.dataset.messageId );
}

function registerRatingEventHooks(){
  console.log( "Registering Event Handlers" );

  $("#myTabContent").on("click", "span.glyphicon.glyphicon-thumbs-up", clickedThumbsUp );
  $("#myTabContent").on("click", "span.glyphicon.glyphicon-thumbs-down", clickedThumbsDown );

  socket.on('message liked success', function( messageId ){
    console.log("message liked success");
    var $thumbs = $('span.glyphicon.glyphicon-thumbs-up[data-message-id=' + messageId + ']');
    if ($thumbs.length === 1) {
      console.log("liked matched");
      var likes = $thumbs.parent().find("span.like");
      var dislikes = $thumbs.parent().find("span.dislike");
      likes.text( Number(likes.text()) + 1 );
      dislikes.text( Number(dislikes.text()) - 1 );
    }
  });

  socket.on('message disliked success', function( messageId ){
    console.log("message disliked success");

    var $thumbs = $('span.glyphicon.glyphicon-thumbs-up[data-message-id=' + messageId + ']');
    if ($thumbs.length === 1) {
      console.log("disliked matched");
      var likes = $thumbs.parent().find("span.like");
      var dislikes = $thumbs.parent().find("span.dislike");
      likes.text( Number(likes.text()) - 1 );
      dislikes.text( Number(dislikes.text()) + 1 );
    }
  });

  socket.on('message liked new success', function( messageId ){
    var $thumbs = $('span.glyphicon.glyphicon-thumbs-up[data-message-id=' + messageId + ']');
    if ($thumbs.length === 1) {
      var likes = $thumbs.parent().find("span.like");
      likes.text( Number(likes.text()) + 1 );
    }
  });

  socket.on('message disliked new success', function( messageId ){
    var $thumbs = $('span.glyphicon.glyphicon-thumbs-up[data-message-id=' + messageId + ']');
    if ($thumbs.length === 1) {
      var likes = $thumbs.parent().find("span.dislike");
      likes.text( Number(likes.text()) + 1 );
    }
  });

  socket.on('message unliked success', function( messageId ){
    var $thumbs = $('span.glyphicon.glyphicon-thumbs-up[data-message-id=' + messageId + ']');
    if ($thumbs.length === 1) {
      var likes = $thumbs.parent().find("span.like");
      likes.text( Number(likes.text()) - 1 );
    }
  });

  socket.on('message undisliked success', function( messageId ){
    var $thumbs = $('span.glyphicon.glyphicon-thumbs-up[data-message-id=' + messageId + ']');
    if ($thumbs.length === 1) {
      var dislikes = $thumbs.parent().find("span.dislike");
      dislikes.text( Number(dislikes.text()) - 1 );
    }
  });
}

$(document).ready( function() {
  registerRatingEventHooks();
})
