$(document).ready(function() {

  $("#navbar ul.nav.masthead-nav [href]").each(function() {
    if (this.href == window.location.href) {
      $(this).parent().addClass("active");
    }
   });

});