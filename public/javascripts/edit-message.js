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



  // Set globals
  var id = $('span.glyphicon.glyphicon-thumbs-up').data('messageId');
  var $content = $('div.message');
  var editing = false;
  var $contentEditor = $('#content-editor');

  // Set the date with moment.js
  var date = moment($('.date').data('date')).format('MMM DD, YYYY');
  $('.date').text(date);

  // Ask for the message recipients
  socket.emit('get message recipients', id);

  // Get the message recipients
  socket.on('get message recipients response', function (recipients) {
    var $container = $('#message-recipients-container');
    $container.children().remove();
    var $list = $('<ul>')
      .addClass('list-group')
      .appendTo($container);
    recipients.forEach(function(recipient) {
      var delBtn = $('<span>').addClass('badge').append(
        $('<span>')
          .addClass('glyphicon glyphicon-remove')
          .attr('aria-hidden', 'true')
      );

      delBtn.on('click', function(event) {
        socket.emit('remove recipient', {
          username: recipient.username,
          messageID: id
        })
      });

      $('<li>')
        .addClass('list-group-item')
        .text(recipient.username)
        .append(delBtn)
        .appendTo($list);
    });
  });

  // Add a recipient to a private messageId
  $('#new-recipient-btn').on('click', function (event) {
    event.preventDefault();

    var username = $('#new-recipient').val();
    socket.emit('add recipient', {
      username: username,
      messageID: id
    });
  });

  socket.on('add recipient response', function (username) {
    $('#new-recipient').val('');
    socket.emit('get message recipients', id);
  });

  socket.on('remove recipient response', function () {
    socket.emit('get message recipients', id);
  });

  // Edit content button
  $('#edit-content').on('click', function (event) {
    event.preventDefault();

    // If editing, save the message
    if (editing) {
      editing = false;
      $contentEditor.hide();
      $(this).children().first().removeClass('glyphicon-floppy-disk');
      $(this).children().first().addClass('glyphicon-pencil');
      $(this).html($(this).html().replace('Save', 'Edit'));
      $content.html($contentEditor.val());
      $content.show();

      var data = {
        id: id,
        content: $contentEditor.val()
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
      $content.hide();
      $contentEditor.show();
      $contentEditor.focus();
    }
  });

  // Delete messages
  $('#delete-message').on('click', function(event) {
    event.preventDefault();
    if (window.confirm('Delete geo-message forever?')) {
      socket.emit('delete message', id);
    }
  });
});
