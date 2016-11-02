$(function() {
  socket.on('update message content response', function(error) {

    $('.alert').remove();

    if (error) {
      $('<div>')
        .addClass('alert alert-danger fade in small')
        .append(
          $('<a>')
            .addClass('close')
            .attr('data-dismiss', 'alert')
            .html('&times;')
          )
        .append(
          $('<strong>').text(error)
        ).prependTo('.message-container');
    } else {
      $('<div>')
        .addClass('alert alert-success fade in small')
        .append(
          $('<a>')
            .addClass('close')
            .attr('data-dismiss', 'alert')
            .html('&times;')
          )
        .append(
          $('<strong>').text('Saved changes')
        ).prependTo('.message-container');
    }
  });

  var date = moment($('.date').data('date')).format('MMM DD, YYYY');
  $('.date').text(date);

  var $content = $('p.message');

  var editing = false;
  $('#edit-content').on('click', function(event) {
    event.preventDefault();
    if (editing) {
      editing = false;
      $(this).html($(this).html().replace('Save', 'Edit'));
      $content.attr('contenteditable', 'false');
      $content.removeClass('editable');

      var data = {
        id: $('span.glyphicon.glyphicon-thumbs-up').data('messageId'),
        content: $content.text()
      };
      socket.emit('update message content', data);
    } else {
      editing = true;
      $(this).html($(this).html().replace('Edit', 'Save'));
      $content.attr('contenteditable', 'true');
      $content.addClass('editable');
      $content.focus();
    }
  });
});
