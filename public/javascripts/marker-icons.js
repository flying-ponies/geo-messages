var currentLocationIcon = {
  // SVG PATH FROM FONT AWESOME STREET-VIEW ICON
  path: "M1408 0q0 -63 -61.5 -113.5t-164 -81t-225 -46t-253.5 -15.5t-253.5 15.5t-225 46t-164 81t-61.5 113.5q0 49 33 88.5t91 66.5t118 44.5t131 29.5q26 5 48 -10.5t26 -41.5q5 -26 -10.5 -48t-41.5 -26q-58 -10 -106 -23.5t-76.5 -25.5t-48.5 -23.5t-27.5 -19.5t-8.5 -12 q3 -11 27 -26.5t73 -33t114 -32.5t160.5 -25t201.5 -10t201.5 10t160.5 25t114 33t73 33.5t27 27.5q-1 4 -8.5 11t-27.5 19t-48.5 23.5t-76.5 25t-106 23.5q-26 4 -41.5 26t-10.5 48q4 26 26 41.5t48 10.5q71 -12 131 -29.5t118 -44.5t91 -66.5t33 -88.5zM1024 896v-384 q0 -26 -19 -45t-45 -19h-64v-384q0 -26 -19 -45t-45 -19h-256q-26 0 -45 19t-19 45v384h-64q-26 0 -45 19t-19 45v384q0 53 37.5 90.5t90.5 37.5h384q53 0 90.5 -37.5t37.5 -90.5zM928 1280q0 -93 -65.5 -158.5t-158.5 -65.5t-158.5 65.5t-65.5 158.5t65.5 158.5t158.5 65.5 t158.5 -65.5t65.5 -158.5z",
  fillColor: 'white',
  fillOpacity: 0.8,
  scale:0.02,
  strokeColor: '#282933',
  strokeWeight: 0.75,
  rotation: 180,
  anchor: new google.maps.Point(700, 200)
};

function messageIconWithColor (count) {
  var brightestCount = 10;
  var colors =['#cc0000', '#ff0000', '#ff6666', '#ffcccc', 'white'];
  var brightness = Math.floor(count / brightestCount * (colors.length -1));
  if (brightness > colors.length - 1) {
    brightness = colors.lenth - 1;
  }

  return {
    // SVG PATH FROM BOOTSTRAP GLYPHICON MAP-MARKER
    path: "M648 1169q117 0 216 -60t156.5 -161t57.5 -218q0 -115 -70 -258q-69 -109 -158 -225.5t-143 -179.5l-54 -62q-9 8 -25.5 24.5t-63.5 67.5t-91 103t-98.5 128t-95.5 148q-60 132 -60 249q0 88 34 169.5t91.5 142t137 96.5t166.5 36zM652.5 974q-91.5 0 -156.5 -65 t-65 -157t65 -156.5t156.5 -64.5t156.5 64.5t65 156.5t-65 157t-156.5 65z",
    fillColor: colors[brightness],
    fillOpacity: 0.8,
    scale:0.025,
    strokeColor: 'darkred',
    strokeWeight: 0.75,
    rotation: 180,
    anchor: new google.maps.Point(650, 200)
  };
}







