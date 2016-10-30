socket.on('new message', function() {
  socket.emit('get full messages', map.getCenter());
});

socket.on('nearby full messages', function(rows) {
  console.log('Rendering markers');

  var incomingMessages = {};

  rows.map(function(markerInfo) {
    incomingMessages[markerInfo.id] =  markerInfo;
  });

  var newMessages = {};
  for (incomingMessage in incomingMessages){
    if(!cachedMessages.hasOwnProperty(incomingMessage)) {
      newMessages[incomingMessage] = incomingMessages[incomingMessage];
    }
  }

  Object.keys(newMessages).forEach(function(newMessage) {
    markerInfo = newMessages[newMessage];

    var marker = new google.maps.Marker({
      position: markerInfo.coordinates,
      map: map,
      title: 'Click to view message',
      animation: google.maps.Animation.DROP,
      icon: messageIcon
    });

    newMessages[newMessage] = marker;

    marker.addListener('click', function () {

      var distance = google.maps.geometry.spherical.computeDistanceBetween( marker.getPosition(), centralPosnLatLng );

      if( distance < VISIBILITY_RADIUS ){
        socket.emit('message viewed', markerInfo.id);
        socket.on('message viewed response', function (markerInfo) {

          $('#view-message-modal .modal-title').html(markerInfo.title);
          $('#view-message-modal .author').html("by " + markerInfo.username);
          var date = moment(markerInfo.created_at).format('MMM DD, YYYY');
          $('#view-message-modal .date').html("on " + date);
          $('#view-message-modal .views').html(markerInfo.views + ' views');
          $('#view-message-modal .modal-body .message').html(markerInfo.content);
          $('#view-message-modal .modal-body .likes .like').html(markerInfo.likes);
          $('#view-message-modal .modal-body .likes .dislike').html(markerInfo.dislikes);
          $('#view-message-modal .modal-body .location .city').html(markerInfo.location_name);

          $('#view-message-modal .modal-body .likes .glyphicon.glyphicon-thumbs-up').attr(
            'data-message-id', markerInfo.id );
          $('#view-message-modal .modal-body .likes .glyphicon.glyphicon-thumbs-down').attr(
            'data-message-id', markerInfo.id );

          $('#view-message-modal').modal({
            show: 'true'
          });

        }); //socket.on

      } // if

    }); // marker.addlistener

  });

  cachedMessages = Object.assign(cachedMessages, newMessages);

});



