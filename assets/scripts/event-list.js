var venueID, pageNum;

const venDetailsEl = $("#details");
const venImgEl = $("#ven-image");
const venNameEl = $("#ven-name");
const venCapEl = $("#ven-cap");
const venDescEl = $("#ven-desc");
const venAddrEl = $("#ven-addr");
const venPhoneEl = $("#ven-phone");
const venWebEl = $("#ven-web");
const paginEl = $("#event-pagination");
const eventListEl = $("#event-list");

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
    venImgEl.attr("src", `https://images.sk-static.com/images/media/profile_images/venues/${venueID}/col6`);
    venImgEl.attr("alt", venueDetails.displayName);
    venNameEl.text(venueDetails.displayName);
    venCapEl.text(venueDetails.capacity);
    venDescEl.text(venueDetails.description);
    venAddrEl.text(venueDetails.street);
    venPhoneEl.text(venueDetails.phone);
    venWebEl.text(venueDetails.website);
    venWebEl.attr("href", venueDetails.website);
}

/*
*/
async function displayEventList(eventList) {
    console.log(eventList);
    for (let i = 0; i < eventList.length; i++) {
        eventListEl.append(`
            <li class="col s12 m6 xl4">
                <div class="card black white-text" role="button">
                    <div class="card-content">
                        <img src="https://images.sk-static.com/images/media/profile_images/artists/${eventList[i].performance[0].artist.id}/huge_avatar" alt="Artist_IMAGE" class="responsive-img circle right artist-image">
                        <span class="card-title">Event/Artist Name</span>
                        <p>Showtime 7:30 PM</p>
                        <p>Short description of artist.</p>
                    </div>
                </div>
            </li>
        `);
    }
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
