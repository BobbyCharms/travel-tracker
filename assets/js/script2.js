// DEPENDENCIES (DOM Elements) ====================================================================
let dateTimeEl = document.querySelector("#date-time");
let mapEl = document.querySelector("#map");
let searchButtonEl = document.querySelector("#search-button");
let searchInputEl = document.querySelector(".input");
let origin = document.querySelector("#origin");
let destination = document.querySelector("#destination");
let flightFieldEl = document.querySelector("#flights")
let visitedMarkerEl = document.querySelector("#visited-marker");
let travelMarkerEl = document.querySelector("#travel-marker");
let buttonsColorEl = document.querySelectorAll('.color-toggle');
let remMarkerAllEl=document.querySelector("#remove-all")

// DATA / STATE / GLOBAL VARIABLES
let currentLon;
let currentLat;
let userLocation;
mapboxgl.accessToken =
  "pk.eyJ1IjoibGFlcnQ5OCIsImEiOiJjbGVkNW1yM2UwMG43M3JwY2dsMjUxYjkyIn0.oODAD95bzzjfRE-Y4DhVLw";
  let map = new mapboxgl.Map({
  container: mapEl, // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [-74.5,40], // starting position [lng, lat]
  zoom: 9, // starting zoom
});
let currentLocation = [0,0]; 
let airportList = [];
//data for where the markers will be stored
let visitedLocations = {
  type: 'FeatureCollection',
  features: []
};

let travelLocations = {
  type: 'FeatureCollection',
  features: []
};
//toggle variable to know which button is pressed 
let visitedToggle = false;
let travelToggle = false;


//FUNCTIONS ========================================================================================
//when user clicks search, the button will redirect the map to the new location
//airport section will be updated with the near by airports
function searchButtonListener(event){
    event.preventDefault();
    //get user input
    let searchValue = searchInputEl.value;
    //create the link
    let apiLink = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + searchValue + ".json?access_token=" + mapboxgl.accessToken;

    //fetch the link
    fetch(apiLink)
    .then((response) => response.json())
    .then((data) => {
      //move the map to the new location
      currentLocation = data.features[0].center
      getAirportList();
      map.flyTo({
        center: data.features[0].center,
        speed: 0.7,
        zoom: 7
      });
    });
}

//using the current coordinates, populate the airportList with the near by airports
function getAirportList(){
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '3ead1a2e48msh5551ba3bcc4058bp138489jsn17a9c4d55510',
      'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
    }
  };
  
  fetch('https://aerodatabox.p.rapidapi.com/airports/search/location/' + currentLocation[1] + '/' + currentLocation[0] + '/km/200/10', options)
    .then(response => response.json())
    .then(data => {
      airportList = data.items || [];
      if(airportList.length !== 0){
        buildAirportButtons();
      }
      
    })
    .catch(err => console.error(err));
}

function buildAirportButtons(){
  flightFieldEl.innerHTML = "";
  flightFieldEl.setAttribute = ("class", "section mt-5");
  flightFieldEl.style.display = "inline-flex";
  console.log(airportList);
  for(let i = 0; i < airportList.length; i++){
    console.log(airportList[i]);
    //create a button element with the name of the current airport
    let newButton = document.createElement("button");
    newButton.innerHTML = airportList[i].shortName;
    //button element should have id named "AP-" + i  -> i being the current position on the list
    newButton.setAttribute("id", ("Ap-" + i));
    newButton.setAttribute("class", "airport-button");
    newButton.addEventListener('click', airportButtonListener);
    flightFieldEl.append(newButton);
    
  }
}

function airportButtonListener(event){
  event.preventDefault();
  //get location of the airport on the airportList
  let position = (event.target.getAttribute("id")).split("-");
  position = parseInt(position[1]);
  //get coordinates of the airport
  let currentCoordinates = [airportList[position].location.lon, airportList[position].location.lat];
  
  
  //animate the map to airport position
  map.flyTo({
    center: currentCoordinates,
    speed: 0.7,
    zoom: 10
  });

}

function getCoor(){
    const optionsLoc = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    function success(pos) {
        const crd = pos.coords;
        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        currentLat=crd.latitude;
        console.log(`Longitude: ${crd.longitude}`);
        currentLon = crd.longitude;
        userLocation = [currentLon, currentLat]
        map.setCenter(userLocation)
        return userLocation;
    }
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error, optionsLoc);
}
//When a pin is dropped a property is added to the object with the city name, state, and country
function getCity(lon,lat,obj){
  var baseUrl="http://api.openweathermap.org/geo/1.0/reverse?";
  var longlatAdd="lat=" + lat + "&lon=" + lon;
  var limitAdd = "&limi=" + 2;
  var apiAdd = "&appid=69d4e3163b70b25ade9ac546dae8169a";
  var requestUrl = baseUrl + longlatAdd + limitAdd + apiAdd ;
  console.log(requestUrl);
  fetch(requestUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data)
    cityName = data[0].name;
    cityState = data[0].state;
    cityNat = data[0].country;
    cityProp = cityName + ", " + cityState  + ", " + cityNat;
    console.log(cityProp);
    obj.locationDesc= cityProp;
    console.log(obj);
  })
}

//adding a marker in the map
function addMarker(event){
  event.preventDefault();
  //if visitedToggle is active then we place a visited pin
  //create the object which will represent the pin's location
  if(visitedToggle){
    let newObject = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [event.lngLat.lng, event.lngLat.lat]
      },
    };  
    //adding desc of location to object from coordinated
    getCity(event.lngLat.lng, event.lngLat.lat,newObject);
    //push the object to the features array of the visitedLocations object
    visitedLocations.features.push(newObject);
    //create anew div element for the pin
    let el = document.createElement('div');
    //create classes for the div element so it is styled correctly
    el.className = 'marker visited-marker';
    //add the new element to the map so it displays
    el.setAttribute("id",caller);
    caller++; 
    el.addEventListener("click", remMarker)
    new mapboxgl.Marker(el).setLngLat(newObject.geometry.coordinates).addTo(map);
    //save to local storage
    window.localStorage.setItem("visitedObject", JSON.stringify(visitedLocations));
    console.log(JSON.parse(localStorage.getItem("visitedObject")));
  } else if(travelToggle){ //if travel toggle is active then we place a travel pin 
    //these are the same steps as above but for the travel pin 
    let newObject = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [event.lngLat.lng, event.lngLat.lat] 
      },
    };  
    getCity(event.lngLat.lng, event.lngLat.lat,newObject);
    travelLocations.features.push(newObject);
    let el = document.createElement('div');
    el.className = 'marker travel-marker';
    new mapboxgl.Marker(el).setLngLat(newObject.geometry.coordinates).addTo(map);

    //save to local storage
    window.localStorage.setItem("travelObject", JSON.stringify(travelLocations));
  }
}

allVisited = JSON.parse(localStorage.getItem("visitedObject"))
remMarkerAllEl.addEventListener("click", function(){
  console.log("hey")
})
/*let caller=0;
console.log(JSON.parse(localStorage.getItem("visitedObject")))
allVisited = JSON.parse(localStorage.getItem("visitedObject"))
  for (var a=0;a<allVisited.features.length;a++){
    let el = document.createElement('div');
    el.setAttribute("id",caller);
    caller++;
    el.addEventListener("click", function(){console.log("her")});
    console.log(allVisited.features)
  }
  for (var a=0;a<allVisited.features.length;a++){
function remMarker() {
  if (remToggle)
    var identity = this.id
    var chosen= document.getElementById(identity)
    for (var x = 0;x<visitedLocations.features.length;x++){
      if (visitedLocations.features[x].caller==identity){
        visitedLocations.features.splice(x,1)
        chosen.remove()}}
    for (var y = 0;y<wishlistLocations.features.length;y++){
      if (wishlistLocations.features[y].caller==identity){
        wishlistLocations.features.splice(y,1);
        chosen.remove();
      }}
    
  }*/

//add event listeners for the map buttons, they will toggle the accessability of the addMarker function
function visitedListener(){
  //if other buttons are active, make them inactive 
  travelToggle = false;
  visitedToggle = !visitedToggle;
  //make this button active
  visitedMarkerEl.classList.toggle('active');
  travelMarkerEl.setAttribute('class', 'color-toggle');

  

}
function travelListener(){
  //if other buttons are active, make them inactive 
  visitedToggle = false;
  visitedMarkerEl.setAttribute('class', 'color-toggle');
  //make this button active
  travelToggle = !travelToggle;
  travelMarkerEl.classList.toggle('active');
  

}

// USER INTERACTIONS ===============================================================================
//user can see today's date
dateTimeEl.textContent = "Today, " + dayjs().format('dddd, MMMM D, YYYY');
//user can search for a location 
searchButtonEl.addEventListener("click", searchButtonListener);

//when user views website on mobile the map will re-adjust 
console.log(map);
map.on("resize", function () {
  map.resize();
});

// user can zoom in/out of the map using button
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');

// user can allow the app to locate them
map.addControl(
  new mapboxgl.GeolocateControl({
  positionOptions: {
  enableHighAccuracy: true
  },
  // When active the map will receive updates to the device's location as it changes.
  trackUserLocation: true,
  // Draw an arrow next to the location dot to indicate which direction the device is heading.
  showUserHeading: true
  })
);

// Map full screen button
map.addControl(new mapboxgl.FullscreenControl());


// Flight API 
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'b79d22c47emsh77d61c8e22f2ab4p12dd88jsn0c73dfc004be',
		'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
	}
};

//user can click on the map button's to add a marker 
visitedMarkerEl.addEventListener('click', visitedListener);
travelMarkerEl.addEventListener('click', travelListener);
map.on('click', addMarker);




// INITIALIZATION ==================================================================================
//finding users coordinates
getCoor();

//reassign values to the variables which hold the pins only if there is data in the local storage
if(localStorage.getItem("visitedObject") !== null){
  visitedLocations = JSON.parse(localStorage.getItem("visitedObject"));
}
if(localStorage.getItem("travelObject") !== null){
  travelLocations = JSON.parse(localStorage.getItem("travelObject"));
}

//display the pins on the map
for (const feature of visitedLocations.features) {
  // create a HTML element for each feature
  const el = document.createElement('div');
  el.className = 'marker visited-marker';

  // make a marker for each feature and add to the map
  new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
}
for (const feature of travelLocations.features) {
  // create a HTML element for each feature
  const el = document.createElement('div');
  el.className = 'marker travel-marker';

  // make a marker for each feature and add to the map
  new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
}

