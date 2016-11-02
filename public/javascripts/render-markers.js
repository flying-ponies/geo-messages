socket.on('new message', function() {
  socket.emit('get full messages', map.getCenter());
});

socket.on('message viewed response', function (markerInfo) {
  var date = moment(markerInfo.created_at).format('MMM DD, YYYY')
  $('#view-message-modal .message-append').append(`
      <div class="message-in-append">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
          <h2 class="modal-title">${markerInfo.title}</h2>
          <div class="info">
              <span class="author">by ${markerInfo.username}</span>
              <span class="date">${date}</span>
              <span class="views pull-right">${markerInfo.views} views</span>
          </div>
        </div>

        <div class="modal-body">
          <p class="message">${markerInfo.content}</p>
          <div class="footer">
            <span class="location">
              <span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span>
              <span class="city">${markerInfo.location_name}</span>
            </span>
            <span class="likes pull-right">
              <span class="glyphicon glyphicon-thumbs-up" aria-hidden="true" data-message-id="${markerInfo.id}"></span>
              <span class="like">${markerInfo.likes}</span>
              <span>/</span>
              <span class="glyphicon glyphicon-thumbs-down" aria-hidden="true" data-message-id="${markerInfo.id}"></span>
              <span class="dislike">${markerInfo.dislikes}</span>
            </span>
          </div>
        </div>
      </div>
    `);

  $('#view-message-modal').modal({
    show: 'true'
  });

}); // socket.on('message viewed response', function (markerInfo) {

var firstMarkerRender = true;

socket.on('nearby full messages', function(rows) {
  console.log('Rendering markers');

  var incomingMessages = [];

  rows.map(function(markerInfo) {
    incomingMessages.push({markerInfo: markerInfo});
  });

  var newMessages = [];
  incomingMessages.forEach(function(incomingMessage) {
    var unique = true;
    cachedMessages.forEach(function(cachedMessagesPerPosition) {
      cachedMessagesPerPosition.forEach(function(cachedMessage) {
        if (cachedMessage.markerInfo.id === incomingMessage.markerInfo.id) {
          unique = false;
        }
      });
    });
    if(unique) {
      newMessages.push(incomingMessage);
    }
  });

  newMessages.forEach(function(newMessage, i) {
    var markerInfo = newMessage.markerInfo;

    var MarkerRenderOptions = {
      position: markerInfo.coordinates,
      map: map,
      title: 'Click to view message',
      icon: messageIconWithColor(0)
    }

    if (!firstMarkerRender) {
      MarkerRenderOptions.animation = google.maps.Animation.DROP;
    }

    var marker = new google.maps.Marker(MarkerRenderOptions);

    newMessages[i].marker = marker;

    marker.addListener('click', function () {

      var distance = google.maps.geometry.spherical.computeDistanceBetween( marker.getPosition(), centralPosnLatLng );

      if( distance < VISIBILITY_RADIUS ){
        socket.emit('message viewed', markerInfo.id);
        $('#view-message-modal .message-append').empty();
        $('#view-message-modal .message-append').removeClass('multiple');

      } // if( distance < VISIBILITY_RADIUS ){

    }); // marker.addListener('click', function () {

  }); // Object.keys(newMessages).forEach(function(newMessage) {

  //  PUSH TO CACHED MESSAGES
  newMessages.map(function(newMessage) {
    var newMesagesPerPosition = [];
    newMesagesPerPosition[0] = {markerInfo: newMessage.markerInfo};
    newMesagesPerPosition.marker = newMessage.marker;
    cachedMessages.push(newMesagesPerPosition);
  });

  setTimeout(function() {
    // CLUMP CACHED MESSAGES THAT ARE CLOSE TOO EACH OTHER
    cachedMessages.forEach(function(cachedMessagesPerPositionA, indexA) {

      coordA = new google.maps.LatLng(
        cachedMessagesPerPositionA[0].markerInfo.coordinates.lat,
        cachedMessagesPerPositionA[0].markerInfo.coordinates.lng
      );

      var indexB = 0;
      while(indexB < cachedMessages.length) {

        coordB = new google.maps.LatLng(
          cachedMessages[indexB][0].markerInfo.coordinates.lat,
          cachedMessages[indexB][0].markerInfo.coordinates.lng
        );

        var distanceAB = google.maps.geometry.spherical.computeDistanceBetween(coordA, coordB);

        if ( distanceAB < MESSAGE_TOO_CLOSE && indexA !== indexB) {

          cachedMessages[indexB].marker.setMap(null);

          cachedMessages[indexB].forEach(function(cachedMessageB) {
            cachedMessages[indexA].push(cachedMessageB);
          });
          cachedMessages.splice(indexB, 1);
          google.maps.event.clearInstanceListeners(cachedMessages[indexA].marker)
          // cachedMessages[indexA].marker.set('label', {
          //   text: cachedMessages[indexA].length,
          //   color: 'white'
          // });

          cachedMessages[indexA].marker.set('icon', messageIconWithColor(cachedMessages[indexA].length));

          cachedMessages[indexA].sort(function(a,b){
            return new Date(b.markerInfo.created_at) - new Date(a.markerInfo.created_at);
          });

          cachedMessages[indexA].marker.addListener('click', function () {

            var distance = google.maps.geometry.spherical.computeDistanceBetween( cachedMessages[indexA].marker.getPosition(), centralPosnLatLng );

            if( distance < VISIBILITY_RADIUS ){
              $('#view-message-modal .message-append').empty()
              $('#view-message-modal .message-append').addClass('multiple');

              cachedMessages[indexA].forEach(function(cachedMessage) {
                socket.emit('message viewed', cachedMessage.markerInfo.id);
              });

            } // if( distance < VISIBILITY_RADIUS ){

          }); // marker.addListener('click', function () {

        } else {
          indexB += 1;
        }
      } // while(indexB < cachedMessages.length)

    }) // cachedMessages.forEach(function(cachedMessagesPerPositionA, indexA)
  }, 500); //setTimeout

  firstMarkerRender = false;

});


