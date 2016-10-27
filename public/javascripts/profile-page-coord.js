var coord;

$( document ).ready( function() {

  function initMap() {
    function success(pos) {
        coord = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    }

    function error(err){
        console.log("Error in geolocation: ", err);
    }

    options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0
    };

    navigator.geolocation.watchPosition(success, error, options);

  }

  initMap();

});