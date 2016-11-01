socket.on('new message', function() {
  socket.emit('get full messages', map.getCenter());
});

var firstMarkerRender = true;

function fillMessage(markerInfo, extraSelectString){

  $('#view-message-modal #' + extraSelectString + ' .modal-title').html(markerInfo.title);
  $('#view-message-modal #' + extraSelectString + ' .author').html("by " + markerInfo.username);
  var date = moment(markerInfo.created_at).format('MMM DD, YYYY');
  $('#view-message-modal #' + extraSelectString + ' .date').html(" on " + date);
  $('#view-message-modal #' + extraSelectString + ' .views').html(markerInfo.views + ' views');
  $('#view-message-modal #' + extraSelectString + ' .modal-body .message').html(markerInfo.content);
  $('#view-message-modal #' + extraSelectString + ' .modal-body .likes .like').html(markerInfo.likes);
  $('#view-message-modal #' + extraSelectString + ' .modal-body .likes .dislike').html(markerInfo.dislikes);
  $('#view-message-modal #' + extraSelectString + '  .modal-body .location .city').html(markerInfo.location_name);


  $('#view-message-modal #' + extraSelectString + ' .modal-body .likes .glyphicon.glyphicon-thumbs-up').attr( 'data-message-id', markerInfo.id );
  $('#view-message-modal #' + extraSelectString + ' .modal-body .likes .glyphicon.glyphicon-thumbs-down').attr( 'data-message-id', markerInfo.id );

  console.log("message id:", markerInfo.id );

  $('#view-message-modal').modal({
    show: 'true'
  });
}

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


  tooCloseMessages = {};
  Object.values(cachedMessageIdsAndMarkers).forEach(function(cachedMessageMarker) {
    Object.values(cachedMessageIdsAndMarkers).forEach(function(candidateMessageMarker) {

      //console.log( "message: ", cachedMessage.position.lat(), ",", cachedMessage.position.lng() );

      if( candidateMessageMarker != cachedMessageMarker )
      {
        var distance = google.maps.geometry.spherical.computeDistanceBetween( cachedMessageMarker.marker.position, candidateMessageMarker.marker.position );

        console.log("distance:", distance, cachedMessageMarker.marker.position.lat(), ",", cachedMessageMarker.marker.position.lng(), candidateMessageMarker.marker.position.lat(), ",", candidateMessageMarker.marker.position.lng());

        if( distance  <= MESSAGE_TOO_CLOSE ){
          if( tooCloseMessages.hasOwnProperty( cachedMessageMarker.id ) ){
            tooCloseMessages[cachedMessageMarker.id].push( candidateMessageMarker );
          }
          else {
            tooCloseMessages[cachedMessageMarker.id] = [ candidateMessageMarker ];
          }
        }
      }
    });
  });

  newMessageIdsAndMarkers = newMessages;

  Object.keys(newMessages).forEach(function(newMessage) {
    var markerInfo = newMessages[newMessage];

    var MarkerRenderOptions = {
      position: markerInfo.coordinates,
      map: map,
      title: 'Click to view message',
      icon: messageIcon
    }

    if (!firstMarkerRender) {
      MarkerRenderOptions.animation = google.maps.Animation.DROP;
    }

    var marker = { marker: new google.maps.Marker(MarkerRenderOptions), id:newMessage };

    newMessages[newMessage] = marker.marker;
    newMessageIdsAndMarkers[newMessage] = marker;

    marker.marker.addListener('click', function () {

      var distance = google.maps.geometry.spherical.computeDistanceBetween( marker.marker.getPosition(), centralPosnLatLng );

      if( distance < VISIBILITY_RADIUS ){

        socket.emit('message viewed', markerInfo.id);

        console.log( "markerInfo.id:", markerInfo.id );
        console.log( "tooCloseMessages:", tooCloseMessages );

        if( tooCloseMessages.hasOwnProperty(markerInfo.id) ){
          console.log( "Too close message id's: ", tooCloseMessages[markerInfo.id] );

          var clumpedMessages = [];
          for( var idIndex = 0; idIndex < tooCloseMessages[markerInfo.id].length; idIndex++ ){
            clumpedMessages.push( tooCloseMessages[markerInfo.id][idIndex].id );
          }
          socket.emit('clumped messages', clumpedMessages);
        }

      } // if( distance < VISIBILITY_RADIUS ){

    }); // marker.addListener('click', function () {

  }); // Object.keys(newMessages).forEach(function(newMessage) {

  cachedMessages = Object.assign(cachedMessages, newMessages);
  cachedMessageIdsAndMarkers = Object.assign( cachedMessageIdsAndMarkers,
                                              newMessageIdsAndMarkers );
  firstMarkerRender = false;

});

function removeMessageContainers(){
  var i = 1;
  var searchResults = $( '#message-container' + i );
  var searchResultHits = searchResults.length;
  while( searchResultHits ){
    searchResults.remove();
    i++;
    searchResults = $( '#message-container' + i );
    searchResultHits = $( '#message-container' + i ).length;
  }
}

socket.on('message viewed response', function (markerInfo) {
  console.log( "message viewed response, pre fillMessage" );
  fillMessage( markerInfo, "message-container0" );
  removeMessageContainers();
  console.log( "message viewed response, post fillMessage" );
}); // socket.on('message viewed response', function (markerInfo) {


socket.on( 'clumped messages returned', function(otherMessages) {
  console.log('clumped messages returned: ', otherMessages.length);
  for( var otherMessage, i=0;  i < otherMessages.length; i++ ){
    otherMessage = otherMessages[i];
    console.log("otherMessage");

    if( $("#message-container" + (i+1)).length === 0 ){
      $(".messages-container") // div:first-child")
        .append(
        '<div class="message-container" id="message-container'+ (i+1) +'">' +
            '<div class="modal-header">' +
              '<h2 class="modal-title"></h2>' +
              '<div class="info">' +
                '<span class="author"></span>' +
                '<span class="date"></span>' +
                '<span class="views pull-right"></span>' +
              '</div>'+
            '</div>' +
            '<div class="modal-body">' +
              '<p class=message></p>' +
              '<div class="footer">' +
                '<span class="location">' +
                  '<span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span>' +
                  '<span class="city"></span>' +
                '</span>' +
                '<span class="likes pull-right">' +
                  '<span class="glyphicon glyphicon-thumbs-up" aria-hidden="true" data-message-id=""></span>' +
                  '<span class="like"></span>' +
                  '<span> / </span>' +
                  '<span class="glyphicon glyphicon-thumbs-down" aria-hidden="true" data-message-id=""></span>' +
                  '<span class="dislike"></span>' +
                '</span>' +
              '</div>' +
            '</div>' +
        '</div>');
    }


    console.log("preFillMessage");
    fillMessage( otherMessage, "message-container" + (i+1) );
    console.log("postFillMessage");

    $("span.glyphicon.glyphicon-thumbs-up").click( clickedThumbsUp );
    $("span.glyphicon.glyphicon-thumbs-down").click( clickedThumbsDown );
  }
});



