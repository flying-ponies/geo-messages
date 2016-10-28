socket.on('new message', function() {
  socket.emit('get full messages', map.getCenter());
});

socket.on('nearby full messages', function(rows) {
  console.log('Rendering markers');

  for (i in cachedMessages) {
    cachedMessages[i].setMap(null);
  }

  cachedMessages = [];

  rows.map(function(markerInfo) {

    var marker = new google.maps.Marker({
      position: markerInfo.coordinates,
      map: map,
      title: 'Click to view message'
    });

    cachedMessages.push(marker);

    marker.addListener('click', function() {

      var distance = google.maps.geometry.spherical.computeDistanceBetween( marker.getPosition(), centralPosnLatLng );

      if( distance < VISIBILITY_RADIUS ){
        $('#view-message-modal .modal-title').html(markerInfo.title);
        $('#view-message-modal .author').html("by " + markerInfo.username);
        var date = moment(markerInfo.created_at).format('MMM DD, YYYY');
        $('#view-message-modal .date').html("on " + date);
        $('#view-message-modal .views').html(markerInfo.views + ' views');
        $('#view-message-modal .modal-body .message').html(markerInfo.content);
        $('#view-message-modal .modal-body .likes .like').html(markerInfo.likes);
        $('#view-message-modal .modal-body .likes .dislike').html(markerInfo.dislikes);
        positionToCityName(marker.position.lat(),marker.position.lng(), function(city) {
          $('#view-message-modal .modal-body .location .city').html(city);
        });

        $('#view-message-modal').modal({
          show: 'true'
        });
      }

    });

  });

});



