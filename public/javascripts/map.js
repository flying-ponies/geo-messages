console.log('initMap declaration...');
var map;
var coord;
var centralPosnLatLng;
var mapCenterCoord;
var VISIBILITY_RADIUS = 400;
var cachedMessages = [];
var followPosn = true;

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
  $(controlUI).on('click', function() {
    console.log("CAKSD",$(controlText).hasClass('active'));

    if ($(controlText).hasClass('active')){
      followPosn = false;
      $(controlText).removeClass('active');
    } else {
      followPosn = true;
      map.panTo(centralPosnLatLng);
      socket.emit('get full messages', map.getCenter());
      $(controlText).addClass('active');
    }
  });

  map.addListener('drag', function() {
    followPosn = false;
    $(controlText).removeClass('active');
  });

}

$(document).ready( function() {

  function initMap() {
    console.log( 'initializing the map...' );

    var originalCoord;
    var firstCall =  true;

    var options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0
    };

    var mapCircle;
    var currentPosnMarker;
    var posnLockControlDiv;
    var posnLockControl;

    // DEMO ONLY CONTROLS
    $(document).on('keypress', function(event){
      var up = '∑';
      var down = 'ß';
      var left = 'å';
      var right = '∂';
      var step = .00025;
      var pos;
      if (event.key === up) {
        pos = {coords:
          {latitude: coord.lat + step, longitude: coord.lng}
        };
        success(pos);
      } else if (event.key === down) {
        pos = {coords:
          {latitude: coord.lat - step, longitude: coord.lng}
        };
        success(pos);
      } else if (event.key === left) {
        pos = {coords:
          {latitude: coord.lat, longitude: coord.lng - step}
        };
        success(pos);
      } else if (event.key === right) {
        pos = {coords:
          {latitude: coord.lat, longitude: coord.lng + step}
        };
        success(pos);
      }
    });
    // END OF DEMO ONLY CONTROLS

    function success(pos){

      coord = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      centralPosnLatLng = new google.maps.LatLng( coord.lat, coord.lng );

      if( firstCall ) {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
          minZoom: 14,
          maxZoom: 18,
          center: coord,
          streetViewControl: false,
          mapTypeControl: false,
          scaleControl: false,
          zoomControl: false,
          keyboardShortcuts: false,
          styles: mapStyleArr
        });

        mapCircle = new InvertedCircle({
          map: map,
          radius: 400,
          stroke_weight: 0.5,
          always_fit_to_map: false,
          resize_updown: '',
          resize_leftright: '',
          editable: false
        });

        currentPosnMarker = new google.maps.Marker({
          map: map,
          title: 'Current Postion',
          icon: currentLocationIcon
        });

        currentPosnMarker.addListener('click', function() {
          $('.new-message-modal').modal({
            show: 'true'
          });
        });

        // POSITION LOCK DIV ELEMENT
        posnLockControlDiv = document.createElement('div');
        posnLockControl = new PosnLockControl(posnLockControlDiv, map);
        posnLockControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(posnLockControlDiv);

        // UPDATES MAP ON DRAG
        var originalMapCenterCoord = map.getCenter();
        map.addListener('drag', function() {
          var distanceScrolled = google.maps.geometry.spherical.computeDistanceBetween(
            map.getCenter(),
            originalMapCenterCoord
          );
          if( distanceScrolled > VISIBILITY_RADIUS ){
            originalMapCenterCoord =  map.getCenter();
            socket.emit('get full messages', map.getCenter());
          }
        });

        map.setCenter( coord );
        socket.emit('get full messages', map.getCenter());
        originalCoord = centralPosnLatLng;
      } // if (firstCall)

      firstCall = false;

      if (followPosn) {
        map.panTo(centralPosnLatLng);
      }

      currentPosnMarker.setPosition(centralPosnLatLng);

      // UPDATES MAP ON WALKING AND LOCK ON CURRENT POSITION
      var distanceTraveled = google.maps.geometry.spherical.computeDistanceBetween(
        centralPosnLatLng,
        originalCoord
      );
      if( distanceTraveled > VISIBILITY_RADIUS && followPosn ){
        originalCoord =  new google.maps.LatLng( centralPosnLatLng.lat(), centralPosnLatLng.lng() );
        socket.emit('get full messages', map.getCenter());
      }

      console.log("success, current coord: ", coord );

      mapCircle.setCenter( centralPosnLatLng );
    }

    function error(err){
      console.log("Error in geolocation: ", err);
    }

    var id = navigator.geolocation.watchPosition(success, error, options);

  }
  initMap();
  registerRatingEventHooks();
});
