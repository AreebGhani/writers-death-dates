var n = ["color: #eeeeee", "font-size: 18px", "font-weight: bold"].join(";")
    , o = ["line-height: 20px", "text-decoration: none", "color: #333", "font-size: 14px"].join(";");
function i() {
    console.log("%cWriter Death Dates \n%chttp://writerdeathdates.com/", n, o)
}
$(document).ready(function () {
    i();
    const writersPerPage = 10;
    let currentPage = 1;
    // Initialize an empty array to store the writer data
    let writers = [];
    // Fetch the JSON file and populate the writers array
    $.getJSON("writers.json", function (data) {
        writers = data;
        renderCurrentPage();
    });
    // Function to render the writer list for the current page
    function renderCurrentPage() {
        $(".pagination").show();
        const writerList = $("#writer-list");
        writerList.empty(); // Clear previous list
        const startIndex = (currentPage - 1) * writersPerPage;
        const endIndex = startIndex + writersPerPage;

        const writersToShow = writers.slice(startIndex, endIndex);
        $.each(writersToShow, function (index, writer) {
            const listItem = $("<li>").addClass("list-group-item").text(`${writer.name} - Died on ${writer.deathDate}`);
            writerList.append(listItem);
        });
    }
    // Function to update pagination buttons based on the current page
    function updatePaginationButtons() {
        $("#prev-page").attr("disabled", currentPage === 1);
        $("#next-page").attr("disabled", currentPage === Math.ceil(writers.length / writersPerPage));
    }
    // Event handler for the "Next" button
    $("#next-page").on("click", function () {
        if (currentPage < Math.ceil(writers.length / writersPerPage)) {
            currentPage++;
            renderCurrentPage();
            updatePaginationButtons();
            $('html, body').animate({ scrollTop: 0 }, 200);
        }
    });
    // Event handler for the "Previous" button
    $("#prev-page").on("click", function () {
        if (currentPage > 1) {
            currentPage--;
            renderCurrentPage();
            updatePaginationButtons();
        }
    });
    // Initial rendering of the writer list and pagination
    renderCurrentPage();
    updatePaginationButtons();

    // Function to render the writer list
    function renderWriterList(filteredWriters) {
        const writerList = $("#writer-list");
        writerList.empty(); // Clear previous list
        if (filteredWriters) {
            $.each(filteredWriters, function (index, writer) {
                const listItem = $("<li>").addClass("list-group-item").text(`${writer.name} - Died on ${writer.deathDate}`);
                writerList.append(listItem);
            });
            $(".pagination").hide();
        }
    }

    // Function to handle the add writer form submission
    $("#formAdd").submit(function (event) {
        event.preventDefault(); // Prevent the form from submitting via the browser

        const writerName = $("#writer-name").val();
        const deathDate = $("#death-date").val();

        if (writerName && deathDate) {
            writers.push({ name: writerName, deathDate: deathDate });
            renderCurrentPage();
            updatePaginationButtons();
            $("#writer-name").val("");
            $("#death-date").val("");
        }
    });

    // Function to handle the search button click
    $("#formSearch").submit(function (event) {
        event.preventDefault(); // Prevent the form from submitting via the browser
        const searchInput = $("#search-input").val();
        const filteredWriters = writers.filter(writer => writer.name.toLowerCase().includes(searchInput.toLowerCase()));
        if (filteredWriters.length === 0) {
            alert("Writer Not Found 😥, Try Another . . . ");
        } else {
            renderWriterList(filteredWriters);
        }
    });

    $("#search-input").on("input", function () {
        const searchInput = $("#search-input").val().trim();
        if (searchInput === "") {
            renderCurrentPage();
            updatePaginationButtons();
        }
    })
});