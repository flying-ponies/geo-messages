console.log('initMap declaration...');
var map;
var coord;
var centralPosnLatLng;
var mapCenterCoord;
var VISIBILITY_RADIUS = 400;
var followPosn = true;
var cachedMessages = [];
var currentPosnMarker;

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
    controlText.innerHTML = '<span class="glyphicon glyphicon-lock" aria-hidden="true"></span><h6 class="pull-right">Lock to your position</h6>';
    controlUI.appendChild(controlText);

    // Setup the event listeners
    controlUI.addEventListener('click', function() {
      followPosn = true;
      map.panTo(centralPosnLatLng);
      socket.emit('get full messages', map.getCenter());
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

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      minZoom: 14,
      maxZoom: 18,
      center: myLatlng,
      streetViewControl: false,
      mapTypeControl: false,
      scaleControl: false,
      zoomControl: false,
      styles: mapStyleArr
    });

    currentPosnMarker = new google.maps.Marker({
      map: map,
      title: 'Current Postion',
      icon: currentLocationIcon
    });

    var options, id, originalCoord, originalMapCenterCoord = {};
    var mapCircle = new InvertedCircle({
          map: map,
          radius: 400,
          stroke_weight: 0.5,
          always_fit_to_map: false,
          resize_updown: '',
          resize_leftright: '',
          editable: false
        });

    var firstCall =  true;

    // POSITION LOCK DIV ELEMENT
    var posnLockControlDiv = document.createElement('div');
    var posnLockControl = new PosnLockControl(posnLockControlDiv, map);
    posnLockControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(posnLockControlDiv);

    // UPDATES MAP ON DRAG
    originalMapCenterCoord = map.getCenter();
    map.addListener('drag', function() {
      var distanceScrolled = google.
        maps.
        geometry.
        spherical.
        computeDistanceBetween( map.getCenter(), originalMapCenterCoord );
      if( distanceScrolled > VISIBILITY_RADIUS ){
        originalMapCenterCoord =  map.getCenter();
        socket.emit('get full messages', map.getCenter());
      }
    });

    // DEMO ONLY CONTROLS
    $(document).on('keypress', function(event){
      var up = '∑';
      var down = 'ß';
      var left = 'å';
      var right = '∂';
      var step = .00025;
      if (event.key === up) {
        var pos = {coords:
          {
            latitude: coord.lat + step,
            longitude: coord.lng
          }
        };
      } else if (event.key === down) {
        var pos = {coords:
          {
            latitude: coord.lat - step,
            longitude: coord.lng
          }
        };
      } else if (event.key === left) {
        var pos = {coords:
          {
            latitude: coord.lat,
            longitude: coord.lng - step
          }
        };
      } else if (event.key === right) {
        var pos = {coords:
          {
            latitude: coord.lat,
            longitude: coord.lng + step
          }
        };
      }
      if (event.key === up || event.key === down || event.key === left || event.key === right) {
        success(pos);
      }
    });
    // END OF DEMO ONLY CONTROLS

    function success(pos){

      coord = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      centralPosnLatLng = new google.maps.LatLng( coord.lat, coord.lng );

      currentPosnMarker.setPosition(centralPosnLatLng);

      if (followPosn) {
        map.panTo(centralPosnLatLng);
      }

      if( firstCall ) {
        map.setCenter( coord );
        socket.emit('get full messages', map.getCenter());
        originalCoord = centralPosnLatLng;
      }

      // UPDATES MAP ON WALKING AND LOCK ON CURRENT POSITION
      var distanceTraveled = google.
        maps.
        geometry.
        spherical.
        computeDistanceBetween(centralPosnLatLng, originalCoord );
      if( distanceTraveled > VISIBILITY_RADIUS && followPosn ){
        originalCoord =  new google.maps.LatLng( centralPosnLatLng.lat(), centralPosnLatLng.lng() );
        socket.emit('get full messages', map.getCenter());
      }

      console.log("success, current coord: ", coord );

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

    // map.addListener('center_changed', function() {
    //   // 3 seconds after the center of the map has changed, pan back to the
    //   // marker.
    //   window.setTimeout(function() {
    //     map.panTo(marker.getPosition());
    //   }, 3000);
    // });

    // var GeoMarker = new GeolocationMarker(map);
    // GeoMarker.setCircleOptions(
    //   new google.maps.Circle({
    //           strokeColor: '#DD0000',
    //           strokeOpacity: 0.0,
    //           strokeWeight: 2,
    //           fillColor: '#DD0000',
    //           fillOpacity: 0.0,
    //           map: map,
    //           center: GeoMarker.center,
    //           radius: 40
    //   })
    // );

  }
  initMap();
});
