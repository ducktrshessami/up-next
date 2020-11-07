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
function skEventSearch(zip, query) {
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
                maxPages = Math.ceil(currentPage.resultsPage.totalEntries / perPage);
                results = results.concat(currentPage.resultsPage.results.event);
            }
            resolve(results);
        })
    });
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
