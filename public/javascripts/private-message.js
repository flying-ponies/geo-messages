$(function() {
  var recipientNum = 1;
  function addNewRecipient() {
    recipientNum++;

    var container = $('<div>').addClass('form-group');

    $('<label>')
      .addClass('sr-only')
      .attr('for', 'recipient-' + recipientNum.toString())
      .appendTo(container);

    var input = $('<input>')
      .addClass('form-control')
      .attr('type', 'text')
      .attr('id', 'recipient-' + recipientNum.toString())
      .attr('name', 'recipients')
      .attr('placeholder', 'Recipient ' + recipientNum.toString() + ' Username')
      .attr('autocomplete', 'off')
      .appendTo(container);

    container.insertBefore($('#add-recipient-btn'));
    input.focus();
  }

  function removeLastRecipient() {
    if (recipientNum > 1) {
      $('#recipient-' + recipientNum.toString()).parent().remove();

      recipientNum--;
    }
  }

  $('.new-message-modal').on('hidden.bs.modal', function() {
    while (recipientNum > 1) {
      removeLastRecipient();
    }
  });

  $('#add-recipient-btn').on('click', addNewRecipient);
  $('#remove-recipient-btn').on('click', removeLastRecipient);

  $('#private').on('change', function(event) {
    $('#recipients-container').toggle(this.checked);
  });

  // AUTOFILL SEARCH
  $('#recipients-container').delegate('input[name="recipients"]', 'focus', autofill);

  $('#new-recipient').on('focus', autofill);

  function autofill() {
    var $form = $(this)
    $(this).typeahead({
      highlighter: function(item) {
        var length = $form.val().length;
        return ('<strong>' + item.slice(0, length) + '</strong>' + item.slice(length));
      },
      source: function (query, process) {
        return $.ajax({
          url: location.protocol + '//' + location.host + '/users/search',
          type: 'POST',
          data: {searchTerm: query},
          dataType: 'json',
          success: function(usernames) {
            return typeof usernames == 'undefined' ? false : process(usernames);
          }
        });
      }
    });
  }

});
