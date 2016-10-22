console.log('initMap declaration...');

function initMap() {
  console.log( 'initializing the map...' );

  var myLatlng = {lat: 49.2827, lng: -123.1207};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: myLatlng
  });

  var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
    title: 'Click to zoom'
  });

  map.addListener('center_changed', function() {
    // 3 seconds after the center of the map has changed, pan back to the
    // marker.
    window.setTimeout(function() {
      map.panTo(marker.getPosition());
    }, 3000);
  });

  var GeoMarker = new GeolocationMarker(map);

  marker.addListener('click', function() {
    map.setZoom(17);
    map.setCenter(marker.getPosition());
  });

  dropMessagesStub(myLatlng, map);
}


