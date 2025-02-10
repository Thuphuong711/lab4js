function search(event){
    event.preventDefault();
    console.log("search function called");

    const xhttp = new XMLHttpRequest();
    let term = document.getElementById("term").value;
    console.log("term: ", term);
    xhttp.onreadystatechange = function(){
        console.log("status: ", this.status);
        console.log("readyState: ", this.readyState);
        if(this.readyState == 4 ){
            let response = JSON.parse(this.responseText);
            
            if(this.status === 200){
                let definition = response.definition;
                console.log("term: ", term);
                console.log("definition: ", definition);
        
                let word = "Word: " + term ;
                console.log("word: ", word);
                let wordDefinition = "Definition: " + definition;
                
                document.getElementById("word").innerHTML = word;
                document.getElementById("definition").innerHTML = wordDefinition;
                document.getElementById("requestNum").innerHTML = response.total_number_of_requests;
                document.getElementById("entriesNum").innerHTML = response.total_number_of_words;
            }
            else {
                console.log("term: ", term);
                let request_num = response.total_number_of_requests;
                console.log("request_num: ", request_num);
                word_not_found = response.message.replace("%", `'${term}'` );
 		document.getElementById("word").innerHTML = "";
                document.getElementById("definition").innerHTML = "";
                document.getElementById("requestNum").innerHTML = request_num + ". " + word_not_found;
                document.getElementById("entriesNum").innerHTML = response.total_number_of_words;
            }
        } 
    }
    xhttp.open("GET", "https://coral-app-bgaa4.ondigitalocean.app/api/definitions/?word="+term, true);
    xhttp.send();
}