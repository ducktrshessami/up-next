const venDetailsEl = $("#details");

initPage();

/*
Initialize the page
*/
function initPage() {
    let venueID = handleArgs();
    if (venueID) {
        skGetVenueDetails(venueID)
            .then(displayVenueDetails)
            .catch(console.error);
        skGetEventListFromVenue(venueID)
            .then(displayEventList)
            .catch(console.error);
    }
    else {
        displayEmptiness();
    }
}

/*
Handle query
*/
function handleArgs() {
    let venueID;
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

/*
*/
function displayEmptiness() {

}
