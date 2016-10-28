console.log('initMap declaration...');
 mapStyleArr = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#e7e9f4"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#586181"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#454d6d"
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
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#4b5377"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#afb1bd"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#e7e9f4"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#e7e9f4"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#e7e9f4"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#7a7b87"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#e7e9f4"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#474f78"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#282933"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
];

var coord;
var centralPosnLatLng;
var mapCenterCoord;
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
    controlText.innerHTML = '<span class="glyphicon glyphicon-lock" aria-hidden="true"></span><h6 class="pull-right">Lock to your position</h6>';
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
      minZoom: 14,
      maxZoom: 18,
      center: myLatlng,
      streetViewControl: false,
      mapTypeControl: false,
      scaleControl: false,
      zoomControl: false,
      styles: mapStyleArr
    });

    var options, id, originalCoord, originalMapCenterCoord = {};
    var mapCircle;

    var firstCall =  true;
    var firstDrag =  true;

    var posnLockControlDiv = document.createElement('div');
    var posnLockControl = new PosnLockControl(posnLockControlDiv, map);
    posnLockControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(posnLockControlDiv);

    function success(pos){

      coord = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      centralPosnLatLng = new google.maps.LatLng( coord.lat, coord.lng );


      if (followPosn) {
        map.panTo(centralPosnLatLng);
      }

      if( firstCall ) {
        originalCoord = centralPosnLatLng;
      }

      var distanceTraveled = google.maps.geometry.spherical.computeDistanceBetween(
        centralPosnLatLng, originalCoord );

      if( distanceTraveled > VISIBILITY_RADIUS/40 ){
        console.log( "Distance Traveled triggered" );
        originalCoord =  new google.maps.LatLng( centralPosnLatLng.lat(), centralPosnLatLng.lng() );
        socket.emit('get full messages', coord);
        renderFullMarkers( map );
      }

      map.addListener('drag', function() {

        if( firstDrag ) {
          originalMapCenterCoord = map.getCenter();
        }

        var distanceScrolled = google.maps.geometry.spherical.computeDistanceBetween(
          map.getCenter(), originalMapCenterCoord );

        if( distanceScrolled > VISIBILITY_RADIUS ){
          console.log( "Distance Scrolled triggered" );
          originalMapCenterCoord =  map.getCenter();
          socket.emit('get full messages', map.getCenter());
          renderFullMarkers( map );
        }

        firstDrag = false;

      });


      console.log("success, current coord: ", coord );

      if( firstCall ){
        mapCircle = new InvertedCircle({
          center: centralPosnLatLng,
          map: map,
          radius: 400,
          editable: true,
          stroke_weight: 1,
          always_fit_to_map: false,
          resize_updown: '',
          resize_leftright: '',
          editable: false
        });

        // mapCircle = new google.maps.Circle({
        //         strokeColor: '#0000DD',
        //         strokeOpacity: 0.8,
        //         strokeWeight: 2,
        //         fillColor: '#0000DD',
        //         fillOpacity: 0.35,
        //         map: map,
        //         center: coord,
        //         radius: VISIBILITY_RADIUS
        // });
        socket.emit('get full messages', coord);
        renderFullMarkers( map );//myLatlng, map);
        map.panTo( coord );
      }
      // mapCircle.setCenter( centralPosnLatLng );
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
