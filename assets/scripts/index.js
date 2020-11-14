var zipSearch = $("#search-zip-code");

// Handle last searched ZIP code
let lastSearch = localStorage.getItem("lastSearch");
if (lastSearch) {
    zipSearch.val(lastSearch);
}

// Handle search submit
$(document.body).ready(function() {
    $("form").on("submit", function(event) {
        event.preventDefault();

        lastSearch = zipSearch.val();
        if (lastSearch) {
            window.location.replace("./venue-list.html?q=" + lastSearch);
        }
    });
})
