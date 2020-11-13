var venueID, pageNum;

const venDetailsEl = $("#details");

initPage();

/*
Initialize the page
*/
function initPage() {
    handleArgs();
    if (venueID) {
        skGetVenueDetails(venueID) // Do simultaneously to reduce load
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
    let params = new URLSearchParams(window.location.search);
    pageNum = params.get("page") || 1;
    venueID = params.get("vid");
    if (venueID) {
        localStorage.setItem("lastVenue", venueID);
    }
    else {
        venueID = localStorage.getItem("lastVenue");
    }
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
    venDetailsEl.empty();
    venDetailsEl.append(`
        <div class="card-content">
            <h1 class="center"><a href="./index.html">Please search for a venue first</a></h1>
        </div>
    `);
}
