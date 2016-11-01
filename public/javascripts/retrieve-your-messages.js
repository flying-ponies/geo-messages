$(document).ready( function() {
  var yourMessagesPage = $('#your-messages').attr("current-page");

  socket.emit('retrieve your messages', yourMessagesPage);
  socket.on('your messages', function(results) {
    var yourMessages = results.messages;
    $('#your-messages .messages-container').empty();
    $('#your-messages nav.page-buttons').empty().off();
    if (yourMessages.length === 0) {

      $('#your-messages .messages-container').append(`<div class="lead">You have not posted any Geo-Messages yet.</div>`);

    } else {

      $('#your-messages nav.page-buttons').bootpag({
        total: results.totalPages,
        page: yourMessagesPage,
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
        socket.emit('retrieve your messages', num);
        $('#your-messages').attr("current-page", num)
        yourMessagesPage = num;
      });
      $('#your-messages nav.page-buttons ul.pagination').addClass('pagination-sm');

      yourMessages.forEach(function(message) {
        var date = moment(message.created_at).format('MMM DD, YYYY');
        $('#your-messages .messages-container').append(`
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
        `); // $('#your-messages').append
      });
    } // else
  }); // socket.on('your messages', function(messages)
});
