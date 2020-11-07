var coords;

const zipCode = localStorage.getItem("lastSearch");

initPage();

/*
*/
async function initPage() {
    zpGetCoords(zipCode)
        .then(c => coords = c)
        .then(skGetEventList)
        .then(skGetVenueList)
        .then(displayVenueList)
        .catch(console.error);
}
/*
If my intuition is correct, we can remove &callback=initMap from the Google Maps
script tag inside venue-list.html. Then we move the Google Maps script tag above
this current script's tag as it was originally. Then this page's programming
flows as follows:

> HTML loads
> Google Maps API loads (but doesn't call initMap)
> venue-list.js begins
> initPage gets called
> displayVenueList gets called from within initPage
> Venue list gets built and displayed
> Map centered on stored coordinates gets created
> Map markers for every venue in list gets created
> Map gets displayed
*/

/*
*/
function displayVenueList(venueList) {
    //do stuff
}

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
