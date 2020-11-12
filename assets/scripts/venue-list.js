var coords, zipCode;

initPage();

/*
Initialize the page
*/
async function initPage() {
    handleArgs()
        .then(zpGetCoords)
        .then(c => coords = c)
        .then(skGetEventList)
        .then(skGetVenueList)
        .then(venueList => {
            displayVenueList(venueList);
            initMap(venueList);
        })
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
Handle query
*/
async function handleArgs() {
    let query = (new URLSearchParams(window.location.search)).get("q");
    if (query) {
        zipCode = query;
    }
    else {
        zipCode = localStorage.getItem("lastSearch");
    }
    return zipCode;
}

/*
*/
async function displayVenueList(venueList) {
    //do stuff
    console.log(venueList);
}

// Initialize and add the map
async function initMap(venueList) {    
    for (var i = 0; i < venueList.length; i++) {
        venueList[i].lat;
        venueList[i].lng;
        
    }
    
    
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        //center: coordinate of searched zip code,
        center: coords,
    });

    

    // The marker for venues listed
    const marker = new google.maps.Marker({
        // for loop to grab the lat and lng of the first 25 venues
        //for (var i = 0; i < 25; i++) {
            // Need to create an array of objects with lat and lng so that
            // venue locations can be marked on map

        //};
        //position: of marker
        position: coords,
        map: map,
    });
}

        


