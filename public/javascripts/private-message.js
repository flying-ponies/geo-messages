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
      .attr('name', 'recipients[' + (recipientNum - 1).toString() + ']')
      .attr('placeholder', 'Recipient ' + recipientNum.toString() + ' email')
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

  $('#add-recipient-btn').on('click', addNewRecipient);
  $('#remove-recipient-btn').on('click', removeLastRecipient);

  $('#private').on('change', function(event) {
    $('#recipients-container').toggle(this.checked);
  });

});
