function renderMarkers(map) {
  socket.on('nearby messages', function(rows){
    rows.map(function(markerInfo){

      var marker = new google.maps.Marker({
        position: markerInfo.coordinates,
        map: map,
        title: 'Click to view message'
      });

      marker.addListener('click', function() {

        var distance = google.maps.geometry.spherical.computeDistanceBetween( marker.getPosition(), centralPosnLatLng );

        if( distance < VISIBILITY_RADIUS ){
          $('#view-message-modal .modal-title').html(markerInfo.title);
          $('#view-message-modal .author').html("by " + "USERNAME");
          $('#view-message-modal .date').html("on " + "DATE");
          $('#view-message-modal .modal-body .message').html(markerInfo.content);
          $('#view-message-modal .modal-body .likes .like').html("LIKES");
          $('#view-message-modal .modal-body .likes .dislike').html("DISLIKES");
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
}