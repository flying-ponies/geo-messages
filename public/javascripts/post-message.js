$(document).ready(function() {

  $('.new-message-button').on('click', function() {
    $('.new-message-modal form').removeClass('display-none').get(0).reset();
    $('.new-message-modal .response').addClass('display-none')
  });

  $('.new-message-modal form').on('submit', function(event) {
    event.preventDefault();
    var data = {};
    $.each($(this).serializeArray(), function() {
      data[this.name] = this.value;
    });
    data = Object.assign(data, {
      location: `Point(${coord.lng} ${coord.lat})`
    });
    var $form = $(this);
    socket.emit('post message', data);
    socket.on('post message response', function (response) {

      if (response === 'success') {
        $form.get(0).reset();
        $form.find('.response').removeClass('display-none').html(`
          <div class="alert alert-success fade in">
            <a href="#" class="close" data-dismiss="alert">&times;</a>
            <strong>Success!</strong> Your Geo-Message has been posted successfully.
          </div>
        `);
      } else {

        $form.find('.response').removeClass('display-none').html(`
          <div class="alert alert-danger fade in">
              <a href="#" class="close" data-dismiss="alert">&times;</a>
              <strong>Error!</strong> A problem has occurred while submitting your Geo-Message.
          </div>
        `);
      }
    });

  });

});
