var zipSearch = $("#search-zip-code");

let lastSearch = localStorage.getItem("lastSearch");
if (lastSearch) {
    zipSearch.val(lastSearch);
}

$(document.body).ready(function() {
    $("form").on("submit", function(event) {
        let zip = zipSearch.val();

        event.preventDefault();

        zpGetCoords(zip).then(() => {
            window.location = "./venue-list.html";
        }).catch(console.error);
    });
})
