function store(event) {
    // Prevent the form from submitting and reloading the page
    event.preventDefault();

    console.log("store function called");

    let word = document.getElementById("term").value;
    let definition = document.getElementById("definition").value;
    console.log('word:', word);
    console.log('definition:', definition);

    // Validate the input fields manually (though the HTML 'required' should handle most cases)
    if (!word || !definition) {
        // Show an error message if fields are empty
        document.getElementById("submitResult").innerHTML = "Both fields are required.";
        console.log("Both fields are required.");
        return;
    }

    // Prepare the data for the API call
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://coral-app-bgaa4.ondigitalocean.app/api/definitions/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");

    const data = JSON.stringify({ word: word, definition: definition });
    xhttp.send(data);

    xhttp.onload = function() {
        let response;
        try {
            response = JSON.parse(this.responseText);
        } catch (error) {
            console.log("Error parsing JSON:", error);
            document.getElementById("submitResult").innerHTML = "Error processing the request.";
            return;
        }

        console.log("Parsed response:", response);
        let request_num = response.total_number_of_requests;
        let word_message = response.message.replace("%", `'${word}'`);
        document.getElementById("requestNum").innerHTML = request_num + ", " + word_message;
        document.getElementById("entriesNum").innerHTML = response.total_number_of_words;
        // Testing: display the updated dictionary (if existed)
        if (response.dictionary) {
            console.log("Updated dictionary:", response.dictionary);
        } else {
            console.log("No dictionary return from response.");
        }
    };

}
