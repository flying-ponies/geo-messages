$(document).ready( function() {
  socket.emit('retrieve read messages');
  socket.on('read messages', function(readMessages) {
    $('#read-messages').empty();
    if (readMessages.length === 0) {

      $('#read-messages').append(`<div class="lead">You have not read any Geo-Messages yet.</div>`);

    } else {

      readMessages.forEach(function(message) {
        var date = moment(message.created_at).format('MMM DD, YYYY');
        $('#read-messages').append(`
          <div class="message-container">
            <div class="header">
              <h4 class="message-title">
                ${message.title}
              </h4>
              <div class="info">
                By ${message.username} on ${date}
                <span class="views pull-right">${message.views} views</span>
              </div>
            </div>
            <p class="message">
              ${message.content}
            </p>
            <div class="footer">
              <span class="location">
                <span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span>
                <span class="lat hidden"><%= message.coordinates.lat %></span>
                <span class="lng hidden"><%= message.coordinates.lng %></span>
                <span class="city">${message.location_name}</span>
              </span>
              <span class="likes pull-right">
                <span class="glyphicon glyphicon-thumbs-up" aria-hidden="true" data-message-id="${message.id}"></span>
                <span class="like">${message.likes}</span>
                <span>/</span>
                <span class="glyphicon glyphicon-thumbs-down" aria-hidden="true" data-message-id="${message.id}"></span>
                <span class="dislike">${message.dislikes}</span>
              </span>
            </div>
          </div><!-- message-container -->
        `);
      });
    } // else
  }); // socket.on('read messages', function(messages)
});
