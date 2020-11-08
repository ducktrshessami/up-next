var zipSearch = $("#search-zip-code");

let lastSearch = localStorage.getItem("lastSearch");
if (lastSearch) {
    zipSearch.val(lastSearch);
}

$(document.body).ready(function() {
    $("form").on("submit", function(event) {
        event.preventDefault();

        lastSearch = zipSearch.val();
        zpGetCoords(lastSearch).then(() => {
            localStorage.setItem("lastSearch", lastSearch);
            window.location = "./venue-list.html";
        }).catch(console.error);
    });
})
