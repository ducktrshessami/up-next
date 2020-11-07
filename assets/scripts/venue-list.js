// Initialize and add the map
function initMap() {
    
    // city search input
    var searchCity = $("#search-city").val().trim();
    // The location of Uluru
    //const uluru = { lat: -25.344, lng: 131.036 };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: searchCity,
      //center: uluru,
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
      //position: uluru,
      position: searchCity,
      map: map,
    });
  }