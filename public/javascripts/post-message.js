$(document).ready(function() {

  $('.new-message-button').on('click', function() {
    $('.new-message-modal form').removeClass('display-none').get(0).reset();
    $('.new-message-modal .response').addClass('display-none')
  });

  $('.new-message-modal form').on('submit', function(event) {
    event.preventDefault();
    var data = $(this).serialize();
    var $form = $(this);
    $.ajax({
      type: 'POST',
      data: data,
      url: '/message',
      success: function(data) {
        $form.get(0).reset();
        $form.find('.response').removeClass('display-none').html(`
          <div class="alert alert-success fade in">
            <a href="#" class="close" data-dismiss="alert">&times;</a>
            <strong>Success!</strong> Your Geo-Message has been posted successfully.
          </div>
        `);
        // $('.new-message-modal').modal('toggle');
      },
      fail: function(data) {
        $form.find('.response').removeClass('display-none').html(`
          <div class="alert alert-danger fade in">
              <a href="#" class="close" data-dismiss="alert">&times;</a>
              <strong>Error!</strong> A problem has been occurred while submitting your Geo-Message.
          </div>
        `);
      }
    });
  })

});