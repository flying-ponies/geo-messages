$(document).ready(function() {
  $('#navbar .new-message-button').on('click', function (event) {
    event.preventDefault();
  });

  $('.new-message-modal').on('shown.bs.modal', function () {
    $('#message-title').focus()
  });

  $('.new-message-modal').on('hidden.bs.modal', function() {
    $('.new-message-modal form').removeClass('display-none').get(0).reset();
    $('.new-message-modal .response').addClass('display-none')
    $('#recipients-container').hide();
  });

  $('.new-message-modal form').on('submit', function(event) {
    event.preventDefault();
    var data = {};
    $.each($(this).serializeArray(), function() {
      if (data.hasOwnProperty(this.name)) {
        if (!Array.isArray(data[this.name])) {
          data[this.name] = [data[this.name]];
        }
        data[this.name].push(this.value);
      } else {
        data[this.name] = this.value;
      }
    });
    data = Object.assign(data, {
      location: `Point(${coord.lng} ${coord.lat})`
    });
    var $form = $(this);

    positionToCityName(coord.lat, coord.lng, function(locationName) {
      data.location_name = locationName;
      console.log('DATA', data);
      socket.emit('post message', data);

      socket.on('post message response', function (response) {

        if (response) {
          if (window.location.pathname === '/profile') {
            socket.emit('retrieve your messages', $('#your-messages').attr("current-page"));
          }

          $('.new-message-modal').modal('hide');
          $form.get(0).reset();
        } else {

          $form.find('.response').removeClass('display-none').html(`
            <div class="alert alert-danger fade in">
                <a href="#" class="close" data-dismiss="alert">&times;</a>
                <strong>Error!</strong> A problem has occurred while submitting your Geo-Message.
            </div>
          `);
        }
      }); // socket.on ('post message response'...

    });

  });

});
