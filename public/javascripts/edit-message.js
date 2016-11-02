$(function() {
  // Response to update message content
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

  // Response to delete message
  socket.on('delete message response', function(error) {
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
      // Message deleted, go to profile page
      window.location.href = '/profile';
    }
  });

  // Set the date with moment.js
  var date = moment($('.date').data('date')).format('MMM DD, YYYY');
  $('.date').text(date);


  var $content = $('p.message');
  var editing = false;

  $('#edit-content').on('click', function(event) {
    event.preventDefault();

    // If editing, save the message
    if (editing) {
      editing = false;
      $(this).children().first().removeClass('glyphicon-floppy-disk');
      $(this).children().first().addClass('glyphicon-pencil');
      $(this).html($(this).html().replace('Save', 'Edit'));
      $content.attr('contenteditable', 'false');
      $content.removeClass('editable');

      var data = {
        id: $('span.glyphicon.glyphicon-thumbs-up').data('messageId'),
        content: $content.text()
      };
      socket.emit('update message content', data);
    }
    // If not editing, start editing
    else {
      editing = true;
      if ($(this).children().first().hasClass('glyphicon-pencil')) {
        $(this).children().first().removeClass('glyphicon-pencil')
        $(this).children().first().addClass('glyphicon-floppy-disk')
      }
      $(this).html($(this).html().replace('Edit', 'Save'));
      $content.attr('contenteditable', 'true');
      $content.addClass('editable');
      $content.focus();
    }
  });

  $('#delete-message').on('click', function(event) {
    event.preventDefault();
    var id = $('span.glyphicon.glyphicon-thumbs-up').data('messageId');
    socket.emit('delete message', id);
  });
});
