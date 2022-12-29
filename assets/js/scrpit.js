// Global variables
var userInputEl = $("#userInput");
var searchBtnEl = $("#searchBtn");
var APIKey = '6e326d6c8ab49b68ca54ae4a1a2c19d1';
var cityEl = $("#city");
var tempEl = $("#temp");
var windEl = $("#wind");
var humidityEl = $("#humidity");
var iconEl = $("#icon");


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
                        getWeather(data);
                    });
                } else {
                    alert("Error: " + response.statusText);
                }
            })
}
function getWeather(weather) {
    var day = [];
  
    for(var i=0; i<6; i++) {
      day.push(weather.list[i*8]);
    }
  
    var iconCode = day[0].weather[0].icon;
    var iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"
    console.log(cityEl);
    cityEl.text(weather.city.name + " (" + moment(day[0].dt_txt).format("L") + ")");
    $("#icon").attr("src", iconURL).attr("width", 30).attr("height", 30);
    tempEl.text("Temp: " + day[0].main.temp + " °F");
    windEl.text("Wind: " + day[0].wind.speed + " MPH");
    humidityEl.text("Humidity: " + day[0].main.humidity + "%");
  }

  
searchBtnEl.on('click', getCoordinates);