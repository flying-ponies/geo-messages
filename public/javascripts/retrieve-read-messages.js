$(document).ready( function() {
  var readMessagesPage = $('#read-messages').attr("current-page");

  socket.emit('retrieve read messages', readMessagesPage);
  socket.on('read messages', function(results) {
    var readMessages = results.messages;
    $('#read-messages .messages-container').empty();
    $('#read-messages nav.page-buttons').empty().off();
    if (readMessages.length === 0) {

      $('#read-messages .messages-container').append(`<div class="lead">You have not read any Geo-Messages yet.</div>`);

    } else {

      $('#read-messages nav.page-buttons').bootpag({
        total: results.totalPages,
        page: readMessagesPage,
        maxVisible: 5,
        leaps: true,
        firstLastUse: true,
        first: '←',
        last: '→',
        wrapClass: 'pagination',
        activeClass: 'active',
        disabledClass: 'disabled',
        nextClass: 'next',
        prevClass: 'prev',
        lastClass: 'last',
        firstClass: 'first'
      }).on("page", function(event, num){
        event.preventDefault();
        socket.emit('retrieve read messages', num);
        $('#read-messages').attr("current-page", num)
        readMessagesPage = num;
      });
      $('#read-messages nav.page-buttons ul.pagination').addClass('pagination-sm');

      readMessages.forEach(function(message) {
        var date = moment(message.created_at).format('MMM DD, YYYY');
        $('#read-messages .messages-container').append(`
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
            <div class="message">
              ${message.htmlContent}
            </div>
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
