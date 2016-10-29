function positionToCityName(lat, lng, callback) {
  var latlng = new google.maps.LatLng(lat, lng);
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({'latLng': latlng}, function(results, status) {
    console.log("GEOCODE STATUS: ", status);
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
            var properName;
            for(var i = 0; i < results[1].address_components.length; i++) {
                if (results[1].address_components[i].types[0] == "locality")
                    properName = results[1].address_components[i].short_name;
                if (results[1].address_components[i].types[0] == "administrative_area_level_1")
                    properName += ", " + results[1].address_components[i].short_name;
            }
            callback(properName);
      } else {
        callback("???");
      }
    } else {
      callback("???");
    }
  });
}