const skapi1 = "pE1BwpmMDHJdfs9n"; // We have 2 API keys for no reason in particular
const skapi2 = "4t1Ilns2EQEjn4QW";

/*
Songkick API call to search for location
As of right now the query is a little redundant since ZIP code is required, but just roll with it

@param zip: a string containing the ZIP code
@param query: a string containing the city name to search for

@return: a Promise<Array<object>> that resolves in a list of locations
*/
function skLocationSearch(zip, query) {
    
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
