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
            .catch(console.error);
        skGetEventListFromVenue(venueID)
            .then(list => eventList = list)
            .then(displayEventList)
            .catch(console.error);
        
        eventListEl.click(gotoEvent);
        paginEl.click(handlePagination);
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
*/
async function displayVenueDetails(venueDetails) {
    console.log(venueDetails);
    venImgEl.attr("src", `https://images.sk-static.com/images/media/profile_images/venues/${venueID}/col6`);
    venImgEl.attr("alt", venueDetails.displayName);
    venNameEl.text(venueDetails.displayName);
    venCapEl.text(venueDetails.capacity);
    venDescEl.text(venueDetails.description);
    venAddrEl.text(`${venueDetails.street} ${venueDetails.metroArea.displayName}, ${venueDetails.metroArea.state.displayName} ${venueDetails.zip}`);
    venPhoneEl.text(venueDetails.phone);
    venWebEl.text(venueDetails.website);
    venWebEl.attr("href", venueDetails.website);
}

/*
*/
async function displayEventList() {
    console.log(eventList);
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
        let content = $(".artist-list", currentEventEl);
        for (let j = 0; j < eventList[i].performance.length; j++) {
            content.append(`
                <li>
                    <p>${eventList[i].performance[j].artist.displayName}</p>
                </li>
            `);
        }
        eventListEl.append(currentEventEl);
    }
    displayPagination();
}

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

function displayPagination() {
    paginEl.empty();
    paginEl.append(`<li id="left-arrow" class="${currentPage == 1 ? "disabled" : "waves-effect"}"><a href="#!"><i class="material-icons">chevron_left</i></a></li>`);
    for (var i = 1; i <= totalPages; i++) {
        paginEl.append(`<li class="${i == currentPage ? "active" : "waves-effect"}" data-value="${i}"><a>${i}</a></li>`);
    }
    paginEl.append(`<li id="right-arrow" class="${currentPage == totalPages ? "disabled" : "waves-effect"}"><a href="#!"><i class="material-icons">chevron_right</i></a></li>`);
}

function changePage(n) {
    currentPage = Math.min(Math.max(1, n), totalPages);
    displayEventList();
}

function gotoEvent(event) {
    event.stopPropagation();
    let button = $("[role='button']").has(event.target);
    if (button.length) {
        window.location.href = button.attr("href");
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
