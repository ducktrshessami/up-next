var zipSearch = $("#search-zip-code");

let lastSearch = localStorage.getItem("lastSearch");
if (lastSearch) {
    zipSearch.val(lastSearch);
}

$(document.body).ready(function() {
    $("form").on("submit", function(event) {
        event.preventDefault();

        lastSearch = zipSearch.val();
        if (lastSearch) {
            window.location.replace("./venue-list?q=" + lastSearch);
        }
    });
})
