var listenedNearbyFullMessage = false;

function renderFullMarkers(map) {

console.log("NOT EPENKFLA", cachedMessages);
  for (i in cachedMessages) {
    cachedMessages[i].setMap(null);
  }
  // cachedMessages.forEach(function(message) {
  //   message.setMap(null);
  // });
  cachedMessages = [];
  console.log("OLDSALD", cachedMessages);
  if (!listenedNearbyFullMessage) {
    socket.on('nearby full messages', function(rows) {
      listenedNearbyFullMessage = true;
      console.log(rows.length);
      rows.map(function(markerInfo) {

      markerInfo.coordinates.lat = markerInfo.coordinates.lat + Math.random()/1000;
      markerInfo.coordinates.lng = markerInfo.coordinates.lng + Math.random()/1000;

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
            $('#view-message-modal .modal-body .likes .like').html(markerInfo.liked);
            $('#view-message-modal .modal-body .likes .dislike').html(markerInfo.disliked);
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

}
