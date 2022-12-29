// Global variables
var userInputEl = $("#userInput");
var searchBtnEl = $("#searchBtn");
var APIKey = '6e326d6c8ab49b68ca54ae4a1a2c19d1';





function getCoordinates(event) {
    event.preventDefault();
    var city = userInputEl.val().trim();
    console.log(city);
    if(city) {
        var url = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + APIKey;
        // Fetch API 
        console.log(fetch(url));
        fetch(url)
        //then method used to return a response object promise
            .then(function(response) {
                console.log(response);
                //checks if response is successful
                if(response.ok) {
                    response.json().then(function(data) {
                        
                        //function to display results
                        console.log(data);
                        console.log(data[0].lat);
                        console.log(data[0].lon);
                        getCity(data);
                    });
                } else {
                    alert("Error: " + response.statusText);
                }
            })

        userInputEl.val("");
    } else {
            alert("Enter a city")//alerts user if no text entered
    } 
}

function getCity(coordinates) {
    var latitude = coordinates[0].lat;
    var longtitude = coordinates[0].lon;
    var requestURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longtitude + APIKey
    console.log(requestURL);

    fetch(requestURL)
            .then(function(response) {
                console.log(response);
                if(response.ok) {
                    response.json().then(function(data) {
                        //function to display results
                        console.log(data);
                        console.log(data.list[0]);
                        console.log(data.list[8]);
                    });
                } else {
                    alert("Error: " + response.statusText);
                }
            })
}

searchBtnEl.on('click', getCoordinates);