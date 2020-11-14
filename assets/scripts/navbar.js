document.addEventListener('DOMContentLoaded', function() { // Mobile navbar
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {edge: "right"});
});

$("form").submit(function(event) { // Handle navbar search
    let searchBar = $("input", event.target);

    event.preventDefault();

    if (searchBar.val()) {
        window.location.href = "./venue-list.html?q=" + searchBar.val();
    }
});
