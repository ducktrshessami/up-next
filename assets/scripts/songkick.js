const skapi1 = "pE1BwpmMDHJdfs9n"; // We have 2 API keys for no reason in particular
const skapi2 = "4t1Ilns2EQEjn4QW";

const skPerPage = 50;

/*
Zippopotam.us API call to search for lat/lon coordinates

@param zip: a string containing the ZIP code

@return: a Promise<object> that resolves in {
    lat: float
    lng: float
}
*/
function zpGetCoords(zip) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            method: "GET",
            url: "https://api.zippopotam.us/us/" + zip,
            error: reject
        }).then((response) => {
            resolve({
                lat: parseFloat(response.places[0].latitude),
                lng: parseFloat(response.places[0].longitude)
            });
        });
    });
}

/*
Songkick API call to search for events from a location
Only events that have a venue and are of status "ok" are returned

@param coords: an object {lat: float, lng: float}

@return: a Promise<Array<object>> that resolves in the list of events in the vicinity of the given coordinates
*/
function skGetEventListFromCoords(coords) {
    return skGetEventList(`https://api.songkick.com/api/3.0/events.json?apikey=${skapi1}&location=geo:${coords.lat},${coords.lng}&per_page=${skPerPage}`);
}

/*
Similar to skGetEventListFromCoords, except that it takes a venue's ID

@param venueID: a string containing the venue's ID

@return: a Promise<Array<object>> that resolves in the list of events at the specified venue
*/
function skGetEventListFromVenue(venueID) {
    return skGetEventList(`https://api.songkick.com/api/3.0/venues/${venueID}/calendar.json?apikey=${skapi1}&per_page=${skPerPage}`);
}

/*
The meat of skGetEventListFromCoords and skGetEventListFromVenue
Handles the Songkick API call and data parsing

@param queryURL: a string containing the URL to make a call to

@return: a Promise<Array<object>> that resolves in the list of events based on the call URL
*/
function skGetEventList(queryURL) {
    return new Promise(async function(resolve, reject) {
        let maxPages = 1;
        let results = [];
        for (let i = 1; i <= maxPages; i++) {
            let currentPage = await $.ajax({
                method: "GET",
                url: `${queryURL}&page=${i}`
            });
            maxPages = Math.ceil(currentPage.resultsPage.totalEntries / skPerPage); // I couldn't think of a way to only do this once and not defeat the purpose
            results = results.concat(
                await Promise.all(
                    currentPage.resultsPage.results.event
                        .filter(e => e.status == "ok" && e.venue.id && e.performance.length) // Filter results
                        .map(e => skGetEventDetails(e.id))
                )
            );
        }
        resolve(results);
    });
}

/*
Parse an event list into a venue list (with events in each venue)

@param eventList: a list of events from skGetEventList

@return: an Array<object> of venue objects
*/
function skGetVenueList(eventList) {
    let venues = [];
    for (let i = 0; i < eventList.length; i++) {
        if (eventList[i].venue.street) {
            let vi = venues.findIndex(v => v.id == eventList[i].venue.id);
            if (vi === -1) { // If venue not in list
                vi = venues.length;
                venues.push(eventList[i].venue);
            }
            if (!venues[vi].eventCount) { // If new venue in list
                venues[vi].eventCount = 0;
            }
            venues[vi].eventCount++;
        }
    }
    return venues;
}

/*
Get the extended Venue object from a venue's ID

@param id: a Number containing the venue's id

@return: a Promise<object> that resolves in the Venue object
*/
function skGetVenueDetails(id) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            method: "GET",
            url: `https://api.songkick.com/api/3.0/venues/${id}.json?apikey=${skapi1}`,
            error: reject
        }).then(response => resolve(response.resultsPage.results.venue));
    });
}

/*
Get the extended Event object from a event's ID

@param id: a Number containing the event's id

@return: a Promise<object> that resolves in the Event object
*/
function skGetEventDetails(id) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            method: "GET",
            url: `https://api.songkick.com/api/3.0/events/${id}.json?apikey=${skapi1}`,
            error: reject
        }).then(response => resolve(response.resultsPage.results.event));
    });
}
