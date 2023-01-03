// Global variables
var APIKey = '6e326d6c8ab49b68ca54ae4a1a2c19d1';
var searchFormEl = $("#search-form");
var clearBtnEl = $("#clearBtn");
var currentEl = $("#current");
var cityEl = $("#city");
var tempEl = $("#temp");
var windEl = $("#wind");
var humidityEl = $("#humidity");
var iconEl = $("#icon");
var forecastEl = $("#forecast-cards");
var previousCitiesEl = $("#previous-cities");


var count = 0;
var search = [];
//Function to initialize the page and get local storage
function init() {
    search = JSON.parse(localStorage.getItem("previousSearch"));//pulls previous searches from local storage
    count = JSON.parse(localStorage.getItem("previousCount"));
    if(count==null) {
      count = 0;
    }
    if(search!=null) {
      for(var i=0; i<search.length; i++) {
        var liEl = $("<div>");
        liEl.addClass("list-group-item list-group-item-action");
        liEl.attr("id", "city" + i)
        liEl.text(search[i]);
        previousCitiesEl.append(liEl);
      }
    }

}init();
//Function that gets the coordinates of the city searched by using the API 
function searchAPICoordinates(city) {
  var url = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + APIKey ;
  
		fetch(url)//calls Fetch API 
		.then(function(response) {//method used to return a response object 
			if(response.ok) {//checks if response is successful
				response.json().then(function(data) {//return a body property in JSON format
					if(data.length===0){
            alert("No results found.");
          } else {
            var lat = data[0].lat;
	          var lon = data[0].lon;
            searchAPIWeather(lat, lon);
          }
				});
			} else {
					alert("Error: " + response.statusText);
				}
		})
    //clears the input
    var userInputEl = $("#user-input");
		userInputEl.val("");
}
//Function to get the weather data by passing in city coordinates, uses the Current Weather Data and 5 Day / 3 Hour Forecast API 

function searchAPIWeather(latitude, longtitude) {
            var forecastRequestURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longtitude + APIKey
            var currentRequestURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longtitude + APIKey
            
            fetch(currentRequestURL)//calls Fetch API and uses requestURL as parameter, returns a promise
	        .then(function(response) {//then method used to return a response object (1st promise)
                    if(response.ok) {//checks if response is successful
                        response.json().then(function(data) {//promise to return in JSON format
            if(data.length===0){
              alert("No results found.");
            } else if(search!=null) {
              if(search.includes(data.name)) {
                printCurrentWeather(data);
              } else {
                printCurrentWeather(data);
                searchList(data);
              }
            } else {
              //function to display the results
              printCurrentWeather(data);
              searchList(data);
            }
            
            
                    });
            } else {
                    alert("Error: " + response.statusText);
                }
        })
   

fetch(forecastRequestURL)//calls Fetch API 
	.then(function(response) {//method used to return a response 
		if(response.ok) {//checks if response is successful
			response.json().then(function(data) {//promise to return data in JSON format
        if(data.length===0){
          alert("No results found.");
        } else {
          //function to display results
          forecastEl.text("");//clears previous cards
          for(var i=0; i<40; i++) {
            if((data.list[i].dt_txt.indexOf("09:00:00") > -1) && moment(data.list[i].dt_txt).format("L")!==moment().format("L")) { //checks to output weather at noon for each day
            printForecast(data.list[i], i);
           }
          }
        }
				});
		} else {
				alert("Error: " + response.statusText);
			}
	})
}
//Function used to display current weather
function printCurrentWeather(day) {
    //Pulls weather icon code and URL to creat an image
    var iconCode = day[0].weather[0].icon;
     var iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"

    //Prints the current day results
    cityEl.text(day.name + " (" + moment().format("L") + ")");
    $("#icon").attr("src", iconURL).attr("width", 50).attr("height", 50);
    tempEl.text("Temp: " + day.main.temp + " °F");
    windEl.text("Wind: " + day.wind.speed + " MPH");
    humidityEl.text("Humidity: " + day.main.humidity + "%");
  }
  //Function to display 5 day forcast
  function renderResults() {
    //Create and append cards for everyday
    if(displayCards===false) {
      for(var i=0; i<5; i++) {
        var cardEl = $("<div>");
        cardEl.addClass("card m-3");
        cardEl.attr("id", "day" + i).attr("style", "width: 12rem");
        forecastEl.append(cardEl);
        var cardBodyEl = $("<div>");
        cardBodyEl.addClass("card-body");
        cardEl.append(cardBodyEl);
        var cardHeaderEl = $("<h4>");
        cardHeaderEl.addClass("card-title");
        cardHeaderEl.attr("id", "title" + i);
        cardHeaderEl.text("Date");
        cardBodyEl.append(cardHeaderEl);
        var iconEl = $("<img>");
        iconEl.attr("id", "icon" + i);
        cardBodyEl.append(iconEl);
        var tempEl = $("<p>");
        tempEl.attr("id", "temp" + i);
        tempEl.text("Temp: ");
        cardBodyEl.append(tempEl);
        var windEl = $("<p>");
        windEl.attr("id", "wind" + i);
        windEl.text("Wind: ");
        cardBodyEl.append(windEl);
        var humidEl = $("<p>");
        humidEl.attr("id", "humid" + i);
        humidEl.text("Humidity: ");
        cardBodyEl.append(humidEl);
      }
    }
    displayCards=true;
  }
  
searchBtnEl.on('click', getCoordinates);