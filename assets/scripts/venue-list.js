var coords, zipCode, totalPages, venueList;

var currentPage = 1;

const perPage = 10;
const searchBarEl = $("#search");
const venueListEl =$("#venue-list");
const venuePaginationEl =$("#venue-pagination");

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
        .then(venues => { // Do simultaneously to reduce load
            venueList = venues;
            displayVenueList();
            initMap();
        })
        .catch(console.error);

    $("form").submit(newSearch);
    venueListEl.click(gotoVenue);
    venuePaginationEl.click(handlePagination);
}

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
async function displayVenueList() {
    //do stuff
    console.log(venueList);
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
    venuePaginationEl.empty();
    venuePaginationEl.append(`<li id="left-arrow" class="${currentPage == 1 ? "disabled" : "waves-effect"}"><a href="#!"><i class="material-icons">chevron_left</i></a></li>`);
    for (var i = 1; i <= totalPages; i++) {
        venuePaginationEl.append(`<li class="${i == currentPage ? "active" : "waves-effect"}" data-value="${i}"><a>${i}</a></li>`);
    }
    venuePaginationEl.append(`<li id="right-arrow" class="${currentPage == totalPages ? "disabled" : "waves-effect"}"><a href="#!"><i class="material-icons">chevron_right</i></a></li>`);
}

function changePage(n) {
    currentPage = Math.min(Math.max(1, n), totalPages);
    displayVenueList();
}

function newSearch(event) {
    event.preventDefault();
    if (searchBarEl.val()) {
        window.location.href = "./venue-list.html?q=" + searchBarEl.val();
    }
}

function gotoVenue(event) {
    event.stopPropagation();
    let button = $("[role='button']").has(event.target);
    if (button) {
        window.location.href = "./event-list.html?vid=" + button.attr("data-value");
    }
}

// Initialize and add the map
async function initMap() {   
    
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        //center: coordinate of searched zip code,
        center: coords,
    });


    // loop all lats and lngs for venues
    for (var i = 0; i < venueList.length; i++) {
        // set markers on coordinates
        const venueMarker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            position: { lat: venueList[i].lat, lng: venueList[i].lng},
            label: { text: venueList[i].displayName, color: "white"},
            map: map,
        });

        //setting up infoWindo
        const venueName = new google.maps.InfoWindow({
            content: venueList[i].displayName,
        });
        
        // event listner for marker 
        venueMarker.addListener("click", () => {
            venueName.open(map, venueMarker);
            gotoVenue();
        });
        
    }
}
