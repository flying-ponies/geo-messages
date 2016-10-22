
function dropMessagesStub( centralLatLng, map ){
  var curPosn, marker;

  var messages = ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut odio auctor, maximus ipsum vitae, sodales libero. Sed elementum lorem vel tortor pharetra imperdiet. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis porta enim sed risus lacinia varius. Quisque rhoncus aliquam risus vel iaculis.",

  "Cras maximus porttitor neque sit amet dapibus. In porta mauris ut sollicitudin pharetra. Ut vitae feugiat purus. Curabitur sagittis molestie nunc. Curabitur vel mollis purus. Vestibulum eu justo tortor. Morbi ultricies nunc eget porta dictum. Pellentesque in interdum metus. Sed consectetur lectus sit amet commodo rutrum.",

  "Donec finibus maximus tellus eleifend tristique. Maecenas ultrices metus urna, sit amet cursus lorem varius nec. Phasellus malesuada tortor nec sem consectetur, a posuere urna bibendum. Donec et sapien egestas, vestibulum magna vehicula, aliquet enim. Nunc a urna id quam egestas venenatis id pharetra eros. In et malesuada mi.",

  "Praesent non eros turpis. Morbi fringilla consequat nulla, at malesuada nisl mattis consequat. Cras et blandit mi, eu faucibus ex. Nullam a lectus vitae lacus feugiat fermentum. Vivamus efficitur nisl quis dui viverra, elementum suscipit odio congue. In hac habitasse platea dictumst. Aliquam feugiat volutpat erat, vel maximus nisi pharetra vel.",

  "Etiam luctus malesuada risus sed ultricies. Donec egestas leo at est molestie fermentum. Sed interdum enim nulla, in tempor elit placerat malesuada. Morbi dictum nibh in odio tincidunt mollis. Curabitur eget tempor neque. Ut ut quam enim.",

"Curabitur nisl magna, mattis in nunc id, consequat sagittis ligula. Sed in elit id leo fermentum suscipit at eu nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Morbi placerat enim id dapibus placerat. Praesent suscipit magna velit.",

"Nullam nec ligula a risus ultricies sodales ut id magna. Suspendisse potenti. Praesent ut mi viverra, viverra enim vitae, varius felis. Nam malesuada lacus mi, non mollis urna pretium et. Praesent a risus tempus, interdum neque nec, bibendum nulla.",

"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum luctus ligula quis scelerisque tincidunt. Nunc at neque at leo commodo tempor quis ac leo. Proin dapibus posuere mi, id accumsan eros interdum id. Aliquam finibus ut augue in eleifend. Donec gravida convallis suscipit.",

 "Quisque accumsan elementum neque sit amet efficitur. Duis et neque ut tortor bibendum consequat vitae ut ante. Fusce eu vehicula velit, eu eleifend lorem. Aenean ullamcorper accumsan blandit. Fusce ultricies nulla ipsum, malesuada lacinia purus lacinia eu.",

 "Maecenas ac volutpat sapien, quis bibendum turpis. Donec varius ultrices ligula, eu venenatis quam fermentum id. Suspendisse cursus tristique bibendum. Pellentesque sit amet faucibus urna. Curabitur suscipit metus vitae auctor malesuada. Nulla facilisis suscipit tincidunt."]

  for( var i=0; i<10; i++ ){
    curPosn = { lat: centralLatLng["lat"] + Math.random() * 0.01 - 0.005,
                lng: centralLatLng["lng"] + Math.random() * 0.01 - 0.005};
    marker = new google.maps.Marker({
      position: curPosn,
      map: map,
      title: 'Click to view message'
    });

    function myListener(j){
        marker.addListener('click', function() {
        console.log( messages[j] );
      });
    }
    myListener(i);
  }
}