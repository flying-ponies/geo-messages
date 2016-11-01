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
          $('.new-message-modal').modal('hide');

          // var marker = new google.maps.Marker({
          //   position: markerInfo.coordinates,
          //   map: map,
          //   title: 'Click to view message',
          //   animation: google.maps.Animation.DROP,
          //   icon: messageIcon
          // });

          // cachedMessages.push(marker);

          // marker.addListener('click', function() {

          //   var distance = google.maps.geometry.spherical.computeDistanceBetween( marker.getPosition(), centralPosnLatLng );

          //   if( distance < VISIBILITY_RADIUS ){
          //     socket.emit('message viewed', markerInfo.id);
          //     socket.on('message viewed response', function (markerInfo) {

          //     $('#view-message-modal .modal-title').html(markerInfo.title);
          //       $('#view-message-modal .author').html("by " + markerInfo.username);
          //       var date = moment(markerInfo.created_at).format('MMM DD, YYYY');
          //       $('#view-message-modal .date').html("on " + date);
          //       $('#view-message-modal .views').html(markerInfo.views + ' views');
          //       $('#view-message-modal .modal-body .message').html(markerInfo.content);
          //       $('#view-message-modal .modal-body .likes .like').html(markerInfo.likes);
          //       $('#view-message-modal .modal-body .likes .dislike').html(markerInfo.dislikes);
          //       $('#view-message-modal .modal-body .location .city').html(markerInfo.location_name);

          //       $('#view-message-modal .modal-body .likes .glyphicon.glyphicon-thumbs-up').attr(
          //         'data-message-id', markerInfo.id );
          //       $('#view-message-modal .modal-body .likes .glyphicon.glyphicon-thumbs-down').attr(
          //         'data-message-id', markerInfo.id );

          //       $('#view-message-modal').modal({
          //         show: 'true'
          //       });

          //     });

          //   }

          // });

          $form.get(0).reset();

        //   $form.find('.response').removeClass('display-none').html(`
        //     <div class="alert alert-success fade in">
        //       <a href="#" class="close" data-dismiss="alert">&times;</a>
        //       <strong>Success!</strong> Your Geo-Message has been posted successfully.
        //     </div>
        //   `);

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
