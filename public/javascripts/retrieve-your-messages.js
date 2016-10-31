$(document).ready( function() {
  socket.emit('retrieve your messages');
  socket.on('your messages', function(yourMessages) {
    $('#your-messages').empty();
    yourMessages.forEach(function(message) {
      var date = moment(message.created_at).format('MMM DD, YYYY');
      $('#your-messages').append(`
        <div class="message-container">
          <div class="header">
            <h4 class="message-title">
              ${message.title}
            </h4>
            <div class="info">
              <span class="date">${date}</span>
              <span class="views pull-right">${message.views} views</span>
            </div>
          </div>
          <p class="message">
            ${message.content}
          </p>
          <div class="footer">
            <span class="location">
              <span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span>
              <span class="lat hidden">${message.coordinates.lat}</span>
              <span class="lng hidden">${message.coordinates.lng}</span>
              <span class="city">${message.location_name}</span>
            </span>
            <span class="likes pull-right">
              <span class="glyphicon glyphicon-thumbs-up" data-message-id="${message.id}" aria-hidden="true"></span>
              <span class="like">${message.likes}</span>
              <span>/</span>
              <span class="glyphicon glyphicon-thumbs-down" data-message-id="${message.id}" aria-hidden="true"></span>
              <span class="dislike">${message.dislikes}</span>
            </span>
          </div>
        </div><!-- message-container -->
      `);
    });
  }); // socket.on('your messages', function(messages)
});
