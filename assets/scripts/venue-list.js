var coords, zipCode, totalPages, venueList;

var currentPage = 1;

const perPage = 10;
const mainEl = $("main");
const searchBarEl = $("#search");
const venueListEl =$("#venue-list");
const venuePaginationEl =$("#venue-pagination");

initPage();

/*
Initialize the page
*/
function initPage() {
    handleArgs();
    if (zipCode) {
        zpGetCoords(zipCode)
            .then(c => coords = c)
            .then(skGetEventListFromCoords)
            .then(skGetVenueList)
            .then(venues => { // Do simultaneously to reduce load
                venueList = venues;
                displayVenueList();
                initMap();
            })
            .catch(displayError);

        venueListEl.click(gotoVenue); // Handle click events
        venuePaginationEl.click(handlePagination);
    }
    else {
        displayEmptiness();
    }
    $("form").submit(newSearch); // Handle navbar search
}

/*
Handle URL params and stored recent search
*/
function handleArgs() {
    let params = new URLSearchParams(window.location.search);
    zipCode = params.get("q");
    if (zipCode) {
        localStorage.setItem("lastSearch", zipCode);
    }
    else {
        zipCode = localStorage.getItem("lastSearch");
    }
}

/*
Display a cached venue list on the page
Asynchronous to reduce load times
*/
async function displayVenueList() {
    venueListEl.empty();
    totalPages = Math.ceil(venueList.length / 10); 
    for (var i = (currentPage - 1) * perPage; i < venueList.length && i < currentPage * perPage; i++) {
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
    venuePaginationEl.empty();
    venuePaginationEl.append(`<li id="left-arrow" class="${currentPage == 1 ? "disabled" : "waves-effect"}"><a href="#!"><i class="material-icons">chevron_left</i></a></li>`);
    for (var i = 1; i <= totalPages; i++) {
        venuePaginationEl.append(`<li class="${i == currentPage ? "active" : "waves-effect"}" data-value="${i}"><a>${i}</a></li>`);
    }
    venuePaginationEl.append(`<li id="right-arrow" class="${currentPage == totalPages ? "disabled" : "waves-effect"}"><a href="#!"><i class="material-icons">chevron_right</i></a></li>`);
}

/*
Change page of venue list display
Page number automatically truncated to fit page list

@param n: a number containing the page number to change to
*/
function changePage(n) {
    currentPage = Math.min(Math.max(1, n), totalPages);
    displayVenueList();
}

/*
Handle navbar searches

@param event: a submit even for the form that wraps the search bar in the navbar
*/
function newSearch(event) {
    event.preventDefault();
    if (searchBarEl.val()) {
        window.location.href = "./venue-list.html?q=" + searchBarEl.val();
    }
}

/*
Handle clicking on a venue card and redirect to the event list

@param event: a click event
*/
function gotoVenue(event) {
    event.stopPropagation();
    let button = $("[role='button']").has(event.target);
    if (button.length) {
        window.location.href = "./event-list.html?vid=" + button.attr("data-value");
    }
}

// Initialize and add the map
async function initMap() {   
    // Creates map in map id
    const map = new google.maps.Map(document.getElementById("map"), {
        // Map zoom
        zoom: 10,
        // Centers map on coordinate of searched zip code,
        center: coords,
    });


    // For loop will loop lat, lng, displayName, and id
    for (let i = 0; i < venueList.length; i++) {
        // Set markers on coordinates
        const venueMarker = new google.maps.Marker({
            map: map,
            // Animation drops markers on coordinates 
            animation: google.maps.Animation.DROP,
            // Coordinates - lat and lng looped 
            position: { lat: venueList[i].lat, lng: venueList[i].lng},
            // Labels of venues associated with coordinates looped, font color white
            label: { text: venueList[i].displayName, color: "white"},
        });

        // Setting up infoWindow
        const venueName = new google.maps.InfoWindow({
            content: venueList[i].displayName,
        });
        
        // Event listener for marker 
        venueMarker.addListener("click", () => {
            venueName.open(map, venueMarker);
            // Click takes user to event page for clicked venue
            window.location.href = "./event-list.html?vid=" + venueList[i].id;
        });
        
    }
}

/*
Display message pertaining to the lack of search query
*/
function displayEmptiness() {
    mainEl.empty();
    mainEl.append(`
        <section class="row">
            <div id="details" class="card col s10 m6 offset-s1 offset-m3 black white-text">
                <div class="card-content">
                    <h1 class="center"><a href="./index.html">Please search for a venue first</a></h1>
                </div>
            </div>
        </section>
    `);
}

/*
Display a message explaining possible errors
*/
function displayError() {
    mainEl.empty();
    mainEl.append(`
        <section class="row">
            <div id="details" class="card col s10 m6 offset-s1 offset-m3 black white-text">
                <div class="card-content center">
                    <h1 class="center">An error occured.</h1>
                    <h5>This can happen when something other than a ZIP code is entered, or when services used on this site are unavailable.</h5>
                </div>
            </div>
        </section>
    `);
}
