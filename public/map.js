console.log('initMap declaration...');

var coord;

function initMap() {
  console.log( 'initializing the map...' );

  var myLatlng = {lat: 49.2827, lng: -123.1207};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: myLatlng
  });

  var options, id;
  var mapCircle;

  var firstCall =  true;

  function success(pos){

    coord = { lat: pos.coords.latitude, lng: pos.coords.longitude } ;

    console.log("success; ", coord );

    if( firstCall ){
      mapCircle = new google.maps.Circle({
              strokeColor: '#0000DD',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#0000DD',
              fillOpacity: 0.35,
              map: map,
              center: coord,
              radius: 400.0
      });
      dropMessagesStub( coord, map );//myLatlng, map);
      map.panTo( coord );
    }
    mapCircle.setCenter( new google.maps.LatLng(coord.lat, coord.lng) );
    firstCall = false;
  }

  function error(err){
    console.log("Error in geolocation: ", err);
  }

  options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
  };

  id = navigator.geolocation.watchPosition(success, error, options);


  var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
    title: 'Click to zoom'
  });

  // map.addListener('center_changed', function() {
  //   // 3 seconds after the center of the map has changed, pan back to the
  //   // marker.
  //   window.setTimeout(function() {
  //     map.panTo(marker.getPosition());
  //   }, 3000);
  // });

  var GeoMarker = new GeolocationMarker(map);
  GeoMarker.setCircleOptions(
    new google.maps.Circle({
            strokeColor: '#DD0000',
            strokeOpacity: 0.0,
            strokeWeight: 2,
            fillColor: '#DD0000',
            fillOpacity: 0.0,
            map: map,
            center: GeoMarker.center,
            radius: 40
    })
  );


  marker.addListener('click', function() {
    map.setZoom(17);
    map.setCenter(marker.getPosition());
  });

}


