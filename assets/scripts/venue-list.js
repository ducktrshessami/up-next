var coords, zipCode

var pageNum = 1;

const perPage = 10;
const venueListEl =$("#venue-list");

initPage();

/*
Initialize the page
*/
async function initPage() {
    handleArgs()
        .then(zpGetCoords)
        .then(c => coords = c)
        .then(skGetEventListFromCoords)
        .then(skGetVenueList)
        .then(venueList => { // Do simultaneously to reduce load
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
    let params = new URLSearchParams(window.location.search);
    zipCode = params.get("q");
    if (zipCode) {
        localStorage.setItem("lastSearch", zipCode);
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
    venueListEl.empty();
    for (var i = (pageNum - 1) * perPage; i < venueList.length && i < pageNum * perPage; i++) {
        venueListEl.append(`
            <li class="col s12 m6 xl4">
                <div class="card black white-text" role="button" data-value="${venueList[i].id}">
                <div class="card-content">
                    <img src="https://images.sk-static.com/images/media/profile_images/venues/${venueList[i].id}/col1" alt="${venueList[i].displayName}" class="responsive-img circle right">
                    <span class="card-title">${venueList[i].displayName}</span>
                    <p>${venueList[i].street}</p>
                    <p>Number of Events: ${venueList[i].eventCount}</p>
                </div>
                </div>
            </li>
        `);  
    }
}

// Initialize and add the map
async function initMap(venueList) {   
    
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        //center: coordinate of searched zip code,
        center: coords,
    });


    // loop all lats and lngs for venues
    for (var i = 0; i < venueList.length; i++) {
        // saving lats
        venueList[i].lat;
        // saving lngs
        venueList[i].lng;
        // saving venue name
        venueList[i].displayName;

        // set markers on coordinates
        const venueMarker = new google.maps.Marker({
            position: { lat: venueList[i].lat, lng: venueList[i].lng},
            map: map,
        });

        //setting up infoWindo
        const venueName = new google.maps.InfoWindow({
            content: venueList[i].display,
        });
        
        // event listner for marker
        venueMarker.addListener("click", () => {
            venueName.open(map, venueMarker);
        });
        
    }
}

        


