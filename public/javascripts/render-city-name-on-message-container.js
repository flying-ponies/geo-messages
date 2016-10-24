$(document).ready(function() {

  var messages = $('.message-container')

  $.map(messages, function(messageElement) {
    var lat = $(messageElement).find('.lat').text();
    var lng = $(messageElement).find('.lng').text();
    positionToCityName(lat, lng, function(city) {
      $(messageElement).find('.city').text(city);
    });
  });

});
