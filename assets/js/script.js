// DEPENDENCIES (DOM Elements) ====================================================================
let dateTimeEl = document.querySelector("#date-time");
let mapEl = document.querySelector("#map");
let searchButtonEl = document.querySelector("#search-button");
let searchInputEl = document.querySelector(".input");
let origin = document.querySelector("#origin");
let destination = document.querySelector("#destination");
let flightFieldEl = document.querySelector("#flights");
let remMarkerEl = document.querySelector("#marker-remover-button");

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
      'X-RapidAPI-Key': 'b79d22c47emsh77d61c8e22f2ab4p12dd88jsn0c73dfc004be',
      'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
    }
  };
  
  fetch('https://aerodatabox.p.rapidapi.com/airports/search/location/' + currentLocation[1] + '/' + currentLocation[0] + '/km/200/10', options)
    .then(response => response.json())
    .then(data => {
      airportList = data.items;
      buildAirportButtons();
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


map.addControl(new mapboxgl.FullscreenControl());

// Flight API 
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'b79d22c47emsh77d61c8e22f2ab4p12dd88jsn0c73dfc004be',
		'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
	}
};




// INITIALIZATION ==================================================================================
//finding users coordinates
getCoor();
let caller = 0;
let addMarkerEl = document.querySelector("#marker-button");
let addMarkerWishlistEl = document.querySelector("#marker-button-wishlist");
let visitedLocations = {
  type: 'FeatureCollection',
  features: []
};
let wishlistLocations = {
  type: 'FeatureCollection',
  features: []
};
let visitedToggle = false;
let wishlistToggle = false;
function addMarker(event){
  event.preventDefault();
  if(visitedToggle){
    let newObject = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [event.lngLat.lng, event.lngLat.lat]
      },
    };
    console.log(newObject)
    getCity(event.lngLat.lng, event.lngLat.lat,newObject);
    newObject.caller = caller;
    visitedLocations.features.push(newObject);
    console.log(visitedLocations)
    let el = document.createElement('div');
    el.className = 'marker visited-marker';
    el.setAttribute("id",caller);
    caller++; 
    el.addEventListener("click",remMarker);
    console.log(el)
    new mapboxgl.Marker(el).setLngLat(newObject.geometry.coordinates).addTo(map);
    //save to local storage
    //window.localStorage.setItem("visitedObject", JSON.stringify(visitedLocations));
  } else if(wishlistToggle){
    let newObject = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [event.lngLat.lng, event.lngLat.lat]
      },
    };
    getCity(event.lngLat.lng, event.lngLat.lat,newObject)
    newObject.caller = caller;
    wishlistLocations.features.push(newObject);
    console.log(wishlistLocations.features)
    //[0].caller
    let el = document.createElement('div');
    el.className = 'marker wishlist-marker';
    new mapboxgl.Marker(el).setLngLat(newObject.geometry.coordinates).addTo(map);
    //save to local storage
    //window.localStorage.setItem("wishlistObject", JSON.stringify(wishlistLocations));
  }
}
function visitedListener(){
  visitedToggle = !visitedToggle;
}
function wishlistListener(){
  wishlistToggle = !wishlistToggle;
}
addMarkerEl.addEventListener('click', visitedListener);
addMarkerWishlistEl.addEventListener('click', wishlistListener);
map.on('click', addMarker); 

//Removal of pins
let remToggle = false;
remMarkerEl.addEventListener("click", function (event) {
  event.preventDefault();
  if (remToggle) {
    remToggle = false;
  } else {
  remToggle=true;
  }})

function remMarker() {
  if (remToggle)
    var identity = this.id
    console.log(identity)
    console.log(visitedLocations.features[identity].caller)
    var chosen= document.getElementById(identity)
    chosen.remove()
}
