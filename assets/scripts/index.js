var zipSearch = $("#search-zip-code");

let lastSearch = localStorage.getItem("lastSearch");
if (lastSearch) {
    zipSearch.val(lastSearch);
}

$(document.body).ready(function() {
    $("form").on("submit", function(event) {
        event.preventDefault();

        zpGetCoords(zipSearch.val()).then(() => {
            window.location = "./venue-list.html";
        }).catch(console.error);
    });
})
