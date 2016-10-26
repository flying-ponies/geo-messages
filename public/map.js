console.log('initMap declaration...');

var coord;
var centralPosnLatLng;
var VISIBILITY_RADIUS = 400;
var followPosn = true;

$( document ).ready( function() {

  function PosnLockControl(controlDiv, map) {
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    $(controlUI).addClass('posn-lock-control-UI');
    controlUI.title = 'Click to lock on your position';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    $(controlText).addClass('control-text active');
    controlText.innerHTML = '<span class="glyphicon glyphicon-lock" aria-hidden="true"></span>';
    controlUI.appendChild(controlText);

    // Setup the event listeners
    controlUI.addEventListener('click', function() {
      followPosn = true;
      map.panTo(centralPosnLatLng);
      $(controlText).addClass('active');
    });

    map.addListener('drag', function() {
      followPosn = false;
      $(controlText).removeClass('active');
    });

  }

  function initMap() {
    console.log( 'initializing the map...' );

    var myLatlng = {lat: 49.2827, lng: -123.1207};

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: myLatlng,
      streetViewControl: false,
      mapTypeControl: false,
      scaleControl: false,
      zoomControl: false,
      style:
        [
          {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative.locality",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.business",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          }
        ]
    });

    var options, id, originalCoord = {};
    var mapCircle;

    var firstCall =  true;

    var posnLockControlDiv = document.createElement('div');
    var posnLockControl = new PosnLockControl(posnLockControlDiv, map);
    posnLockControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(posnLockControlDiv);

    function success(pos){

      coord = { lat: pos.coords.latitude, lng: pos.coords.longitude } ;
      centralPosnLatLng = new google.maps.LatLng( coord.lat, coord.lng );

      if (followPosn) {
        map.panTo(centralPosnLatLng);
      }

      if( firstCall ) {
        originalCoord = new google.maps.LatLng( centralPosnLatLng.lat(), centralPosnLatLng.lng() );
      }

      var distanceTraveled = google.maps.geometry.spherical.computeDistanceBetween(
        centralPosnLatLng, originalCoord );

      if( distanceTraveled > VISIBILITY_RADIUS/40 ){
        console.log( "Distance Traveled triggered" );
        originalCoord =  new google.maps.LatLng( centralPosnLatLng.lat(), centralPosnLatLng.lng() );
        socket.emit('update position', coord);
        renderMarkers( map );
      }

      console.log("success, current coord: ", coord );

      if( firstCall ){
        mapCircle = new google.maps.Circle({
                strokeColor: '#0000DD',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#0000DD',
                fillOpacity: 0.35,
                map: map,
                center: coord,
                radius: VISIBILITY_RADIUS
        });
        socket.emit('update position', coord);
        renderMarkers( map );//myLatlng, map);
        map.panTo( coord );
      }
      mapCircle.setCenter( centralPosnLatLng );
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


    // var marker = new google.maps.Marker({
    //   position: myLatlng,
    //   map: map,
    //   title: 'Click to zoom'
    // });



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


    // marker.addListener('click', function() {
    //   map.setZoom(17);
    //   map.setCenter(marker.getPosition());
    // });

  }
  //setTimeout(initMap, 3000);
  initMap();
});
