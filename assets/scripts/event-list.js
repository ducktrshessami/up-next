initPage();

/*
Initialize the page
*/
function initPage() {
    handleArgs()
        .then(venueID => {
            skGetVenueDetails(venueID).then(displayVenueDetails);
            skGetEventListFromVenue(venueID).then(displayEventList);
        })
        .catch(console.error);
}

/*
Handle query
*/
async function handleArgs() {
    let vid = (new URLSearchParams(window.location.search)).get("vid");
    if (vid) {
        venueID = vid;
        localStorage.setItem("lastVenue", vid);
    }
    else {
        venueID = localStorage.getItem("lastVenue");
    }
    return venueID;
}

/*
*/
async function displayVenueDetails(venueDetails) {
    console.log(venueDetails);
}

/*
*/
async function displayEventList(eventList) {
    console.log(eventList);
}
