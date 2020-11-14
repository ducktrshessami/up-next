var venueID, totalPages, eventList;

var currentPage = 1;

const perPage = 10;

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
            .catch(displayError);
        skGetEventListFromVenue(venueID)
            .then(list => eventList = list)
            .then(displayEventList)
            .catch(displayError);
        
        eventListEl.click(gotoEvent); // Handle click events
        paginEl.click(handlePagination);
    }
    else {
        displayEmptiness();
    }
}

/*
Handle URL params and stored recent venue selection
*/
function handleArgs() {
    let params = new URLSearchParams(window.location.search);
    currentPage = params.get("page") || 1;
    venueID = params.get("vid");
    if (venueID) {
        localStorage.setItem("lastVenue", venueID);
    }
    else {
        venueID = localStorage.getItem("lastVenue");
    }
}

/*
Display the chosen venue's details
Asynchronous to reduce load times
*/
async function displayVenueDetails(venueDetails) {
    venImgEl.attr("src", `https://images.sk-static.com/images/media/profile_images/venues/${venueID}/col6`);
    venImgEl.attr("alt", venueDetails.displayName);
    venNameEl.text(venueDetails.displayName);
    venCapEl.text("Capacity: " + (venueDetails.capacity ? venueDetails.capacity : "N/A"));
    venDescEl.text(venueDetails.description);
    venAddrEl.text(`${venueDetails.street} ${venueDetails.metroArea.displayName}, ${venueDetails.metroArea.state.displayName} ${venueDetails.zip}`);
    venPhoneEl.text(venueDetails.phone);
    venWebEl.text(venueDetails.website);
    venWebEl.attr("href", venueDetails.website);
}

/*
Display a cached event list on the page
Asynchronous to reduce load times
*/
async function displayEventList() {
    eventListEl.empty();
    totalPages = Math.ceil(eventList.length / 10);
    for (let i = (currentPage - 1) * perPage; i < eventList.length && i < currentPage * perPage; i++) {
        let currentEventEl = $(`
            <li class="col s12 m6 xl4">
                <div class="card black white-text" role="button" href="${eventList[i].uri}">
                    <div class="card-content">
                        <img src="https://images.sk-static.com/images/media/profile_images/artists/${eventList[i].performance[0].artist.id}/huge_avatar" alt="${eventList[i].performance[0].artist.displayName}" class="responsive-img circle right artist-image">
                        <span class="card-title">${eventList[i].displayName}</span>
                        <p>Showtime: ${moment(eventList[i].start.datetime).format("M/D/YYYY h:mm A")}</p>
                        <ul class="artist-list"></ul>
                    </div>
                </div>
            </li>
        `);
        let content = $(".artist-list", currentEventEl); // List performing artists
        for (let j = 0; j < eventList[i].performance.length; j++) {
            content.append(`
                <li>
                    <p>${eventList[i].performance[j].artist.displayName}</p>
                </li>
            `);
        }
        eventListEl.append(currentEventEl);
    }
    displayPagination(); // Do after getting data and total page count
}

/*
Handle clicking on pagination

@param event: a mouse click event
*/
function handlePagination(event) {
    event.stopPropagation();
    let target = $("li").has(event.target);
    if (target.length) {
        switch (target.attr("id")) {
            case "left-arrow": changePage(currentPage - 1); break;
            case "right-arrow": changePage(currentPage + 1); break;
            default: changePage(parseInt(target.attr("data-value"))); break;
        }
    }
}

/*
Display page numbers and arrows with proper styling
*/
function displayPagination() {
    paginEl.empty();
    paginEl.append(`<li id="left-arrow" class="${currentPage == 1 ? "disabled" : "waves-effect"}"><a><i class="material-icons">chevron_left</i></a></li>`);
    for (var i = 1; i <= totalPages; i++) {
        paginEl.append(`<li class="${i == currentPage ? "active" : "waves-effect"}" data-value="${i}"><a>${i}</a></li>`);
    }
    paginEl.append(`<li id="right-arrow" class="${currentPage == totalPages ? "disabled" : "waves-effect"}"><a><i class="material-icons">chevron_right</i></a></li>`);
}

/*
Change page of event list display
Page number automatically truncated to fit page list

@param n: a number containing the page number to change to
*/
function changePage(n) {
    currentPage = Math.min(Math.max(1, n), totalPages);
    displayEventList();
}

/*
Handle clicking on a venue card and redirect to the event page on Songkick

@param event: a click event
*/
function gotoEvent(event) {
    event.stopPropagation();
    let button = $("[role='button']").has(event.target);
    if (button.length) {
        window.location.href = button.attr("href");
    }
}

/*
Display message pertaining to the lack of search query
*/
function displayEmptiness() {
    venDetailsEl.empty();
    venDetailsEl.append(`
        <div class="card-content">
            <h1 class="center"><a href="./index.html">Please search for a venue first</a></h1>
        </div>
    `);
}

/*
Display a message explaining possible errors
*/
function displayError() {
    venDetailsEl.empty();
    venDetailsEl.append(`
        <div class="card-content center">
            <h1 class="center">An error occured.</h1>
            <h5>This can happen when something other than a ZIP code is entered, or when services used on this site are unavailable.</h5>
        </div>
    `);
}
