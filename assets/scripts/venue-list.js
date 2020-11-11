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
        .then(initMap)
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
    console.log(venueList);

    return venueList;
}

// Initialize and add the map
function initMap(venueList) {    
    for (var i = 0; i < venueList.length; i++) {
        var latitude = venueList[i].lat;
        var longitude =venueList[i].lng;
        var venueMarkers = { lat: latitude, lng: longitude};
    }
    
    
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        //center: coordinate of searched zip code,
        center: coords,
    });

    

    // The marker for venues listed
    const marker = new google.maps.Marker({
        //position: of marker
        position: venueMarkers,
        map: map,
    });
}

        


