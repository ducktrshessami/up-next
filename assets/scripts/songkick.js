const skapi1 = "pE1BwpmMDHJdfs9n"; // We have 2 API keys for no reason in particular
const skapi2 = "4t1Ilns2EQEjn4QW";

const perPage = 50;

/*
Songkick API call to search for events from a location
As of right now the query is a little redundant since ZIP code is required, but just roll with it

@param zip: a string containing the ZIP code
@param query: a string containing the city name to search for

@return: a Promise<Array<object>> that resolves in a list of events
*/
function skGetEventList(zip, query) {
    return new Promise(function(resolve, reject) {
        zpGetState(zip).then(async (coords) => {
            let maxPages = 1;
            let results = [];
            let queryURL = `https://api.songkick.com/api/3.0/events.json?apikey=${skapi1}&location=geo:${coords.lat},${coords.lon}&per_page=${perPage}`;
            for (let i = 1; i <= maxPages; i++) {
                let currentPage = await $.ajax({
                    method: "GET",
                    url: `${queryURL}&page=${i}`
                });
                maxPages = Math.ceil(currentPage.resultsPage.totalEntries / perPage); // I couldn't think of a way to only do this once and not defeat the purpose
                results = results.concat(currentPage.resultsPage.results.event);
            }
            resolve(results);
        })
    });
}

/*
Parse an event list into a venue list (with events in each venue)

@param eventList: a list of events from skGetEventList

@return: an Array<object> of venue objects
*/
function skGetVenueList(eventList) {
    let venues = []
    for (let i = 0; i < eventList.length; i++) {
        if (eventList[i].venue.id) { // Only parse events that have venues
            let vi = venues.findIndex(v => v.id == eventList[i].venue.id);
            if (vi === -1) { // If venue not in list
                vi = venues.length;
                venues.push(eventList[i].venue);
            }
            if (!venues[vi].events) { // If new venue in list
                venues[vi].events = [];
            }
            venues[vi].events.push(eventList[i]);
        }
    }
    return venues;
}

/*
Zippopotam.us API call to search for lat/lon coordinates

@param zip: a string containing the ZIP code

@return: a Promise<object> that resolves in {
    lat: float
    lon: float
}
*/
function zpGetState(zip) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            method: "GET",
            url: "http://api.zippopotam.us/us/" + zip,
            error: reject
        }).then((response) => {
            resolve({
                lat: parseFloat(response.places[0].latitude),
                lon: parseFloat(response.places[0].longitude)
            });
        });
    });
}
