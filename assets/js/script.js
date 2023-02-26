// DEPENDENCIES (DOM Elements) ====================================================================
let dateTimeEl = document.querySelector("#date-time");
let mapEl = document.querySelector("#map");
let searchButtonEl = document.querySelector("#search-button");
let searchInputEl = document.querySelector(".input");
let origin = document.querySelector("#origin");
let destination = document.querySelector("#destination");
let flightFieldEl = document.querySelector("#flights");
let visitedMarkerEl = document.querySelector("#visited-marker");
let travelMarkerEl = document.querySelector("#travel-marker");
let buttonsColorEl = document.querySelectorAll(".color-toggle");
let removeMarkerEl = document.querySelector("#remove-marker");
/*if (localStorage.getItem("caller") !== null) {
  let caller = window.localStorage.getItem("caller");
} else {
  window.localStorage.setItem("caller",0);
  let caller=0;}
//console.log(caller)
/*function idAssign(element){
 // console.log(caller);
 // element.setAttribute("id",caller);
 // caller++;
  //window.localStorage.setItem("caller",caller);
  element.addEventListener("dblclick",removeListener);
}*/
// DATA / STATE / GLOBAL VARIABLES
let currentLon;
let currentLat;
let userLocation;
let markerList=[];
mapboxgl.accessToken =
  "pk.eyJ1IjoibGFlcnQ5OCIsImEiOiJjbGVkNW1yM2UwMG43M3JwY2dsMjUxYjkyIn0.oODAD95bzzjfRE-Y4DhVLw";
let map = new mapboxgl.Map({
  container: mapEl, // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9, // starting zoom
});
let currentLocation = [0, 0];
/*let airportList = [];
//data for where the markers will be stored
let visitedLocations = {
  type: "FeatureCollection",
  features: [],
};

let travelLocations = {
  type: "FeatureCollection",
  features: [],
};*/
//toggle variable to know which button is pressed
let visitedToggle = false;
let travelToggle = false;
let removeToggle=false;/*
//FUNCTIONS ========================================================================================
//when user clicks search, the button will redirect the map to the new location
//airport section will be updated with the near by airports
function searchButtonListener(event) {
  event.preventDefault();
  //get user input
  let searchValue = searchInputEl.value;
  //create the link
  let apiLink =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    searchValue +
    ".json?access_token=" +
    mapboxgl.accessToken;

  //fetch the link
  fetch(apiLink)
    .then((response) => response.json())
    .then((data) => {
      //move the map to the new location
      currentLocation = data.features[0].center;
      getAirportList();
      map.flyTo({
        center: data.features[0].center,
        speed: 0.7,
        zoom: 8,
      });
    });
}

//using the current coordinates, populate the airportList with the near by airports

function getAirportList(){
  const flightApiKey = "6634e3f9-7baf-4aac-a37d-48d8524a8d79"
  
  fetch(`https://airlabs.co/api/v9/nearby?lat=${currentLocation[1]}&lng=${currentLocation[0]}&distance=50&api_key=${flightApiKey}`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      airportList = data.response.airports || [];
      if (airportList.length > 10) {
        airportList.splice(10);
        buildAirportButtons();
      } else if (airportList.length !== 0){

        buildAirportButtons();
      }
    })
    .catch((err) => console.error(err));
}

function buildAirportButtons() {
  flightFieldEl.innerHTML = "";
  flightFieldEl.setAttribute = ("class", "section mt-5");
  flightFieldEl.style.display = "inline-flex";
  console.log(airportList);
  for (let i = 0; i < airportList.length; i++) {
    console.log(airportList[i]);
    //create a button element with the name of the current airport
    let newButton = document.createElement("button");
    newButton.innerHTML = airportList[i].name;
    //button element should have id named "AP-" + i  -> i being the current position on the list
    newButton.setAttribute("id", "Ap-" + i);
    newButton.setAttribute("class", "airport-button");
    newButton.addEventListener("click", airportButtonListener);
    flightFieldEl.append(newButton);
  }
}

function airportButtonListener(event) {
  event.preventDefault();
  //get location of the airport on the airportList
  let position = event.target.getAttribute("id").split("-");
  position = parseInt(position[1]);
  //get coordinates of the airport

  let currentCoordinates = [airportList[position].lng, airportList[position].lat];
  
  //animate the map to airport position
  map.flyTo({
    center: currentCoordinates,
    speed: 0.7,
    zoom: 12,
  });
}
*/
function getCoor() {
  const optionsLoc = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  function success(pos) {
    const crd = pos.coords;
    currentLat = crd.latitude;
    currentLon = crd.longitude;
    userLocation = [currentLon, currentLat];
    map.setCenter(userLocation);
    return userLocation;
  }
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  navigator.geolocation.getCurrentPosition(success, error, optionsLoc);
}

//When a pin is dropped a property is added to the object with the city name, state, and country
function getCity(lon, lat, obj, elem, list) {
  var baseUrl = "https://api.openweathermap.org/geo/1.0/reverse?";
  var longlatAdd = "lat=" + lat + "&lon=" + lon;
  var limitAdd = "&limi=" + 2;
  var apiAdd = "&appid=69d4e3163b70b25ade9ac546dae8169a";
  var requestUrl = baseUrl + longlatAdd + limitAdd + apiAdd;
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
    obj.locationDesc= cityProp;
    //obj.caller =caller;
    //caller++;
    //window.setItem("caller",caller)
    //update local storage 
    window.localStorage.setItem("visitedObject", JSON.stringify(visitedLocations));
    window.localStorage.setItem("travelObject", JSON.stringify(travelLocations)); 
    //add element to the map now since we have the city name
    let newMarker=new mapboxgl.Marker(elem)
    .setLngLat(obj.geometry.coordinates).setPopup(
       new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML(
          `<h3>${cityName}</h3><p>${cityState + ", " + cityNat}</p>` //-------------------------------------------------------------------------------------------------------------------------------------------------------------
        )
    )
    .addTo(map);
    elem.addEventListener("click",function(newMarker){
      if (removeToggle){
        console.log(elem)
        elem.remove();
        console.log(list);
        list.features.splice(i,1);
        console.log(list);
        newMarker.remove();
    }})                             
    //apprend new marker to markerList
    markerList.push(newMarker);
    console.log(markerList)
  })

}
//adding a marker in the map
function addMarker(event) {
  event.preventDefault();
  //if visitedToggle is active then we place a visited pin
  //create the object which will represent the pin's location
  if (visitedToggle) {
    let newObject = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [event.lngLat.lng, event.lngLat.lat],
      },
    };
    
    //push the object to the features array of the visitedLocations object
    visitedLocations.features.push(newObject);
    let i = visitedLocations.findIndex(newObject);
    console.log(i);
    //create anew div element for the pin
    let el = document.createElement("div");
    //create classes for the div element so it is styled correctly
    el.className = "marker visited-marker";
   // el.addEventListener("click", removeElement(el))
    //idAssign(el);
    //add the new element to the map so it displays after we get the location name
    getCity(event.lngLat.lng, event.lngLat.lat, newObject, el, visitedLocations);
    /*el.addEventListener("click",function(){
      if (removeToggle){
        console.log("hey")
      }
    })*/
    //save to local storage
    window.localStorage.setItem(
      "visitedObject",
      JSON.stringify(visitedLocations)
    );
  } else if (travelToggle) {
    //if travel toggle is active then we place a travel pin
    //these are the same steps as above but for the travel pin
    let newObject = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [event.lngLat.lng, event.lngLat.lat],
      },
    };
    travelLocations.features.push(newObject);

    let el = document.createElement("div");
    el.className = "marker travel-marker";
  
    /*if (localStorage.getItem("caller") !== null) {
      let caller = localStorage.getItem("caller");
    } else {
      let caller=0;
    }*/
    //el.addEventListener("click", removeElement(el))
    //add the new element to the map so it displays after we get the location name
    getCity(event.lngLat.lng, event.lngLat.lat, newObject, el, travelLocations);

    //save to local storage
    window.localStorage.setItem(
      "travelObject",
      JSON.stringify(travelLocations)
    );
  }
}

//add event listeners for the map buttons, they will toggle the accessability of the addMarker function
function visitedListener() {
  //if other buttons are active, make them inactive
  removeToggle=false;
  removeMarkerEl.setAttribute("class", "color-toggle");
  travelToggle = false;
  visitedToggle = !visitedToggle;
  //make this button active
  visitedMarkerEl.classList.toggle("active");
  travelMarkerEl.setAttribute("class", "color-toggle");
}
function travelListener() {
  //if other buttons are active, make them inactive
  removeToggle=false;
  removeMarkerEl.setAttribute("class", "color-toggle");
  visitedToggle = false;
  visitedMarkerEl.setAttribute("class", "color-toggle");
  //make this button active
  travelToggle = !travelToggle;
  travelMarkerEl.classList.toggle("active");
}
function removeAllListener () {
  //removeToggle = !removeToggle;
  //removeMarkerEl.classList.toggle("active");
  visitedToggle = false;
  travelToggle = false;
  visitedMarkerEl.setAttribute("class", "color-toggle");
  travelMarkerEl.setAttribute("class", "color-toggle");
  //for every marker in the list, remove it
  for (let d =0;d<markerList.length;d++){
    markerList[d].remove();
   
    //update to local Storage
  }
  console.log(markerList);
  visitedLocations = {
    type: "FeatureCollection",
    features: [],
  };
  
  travelLocations = {
    type: "FeatureCollection",
    features: [],
  };
}
  function removeListener(){
    //console.log("hey")
    removeToggle = !removeToggle;
    removeMarkerEl.classList.toggle("active");
    visitedToggle = false;
    travelToggle = false;
    visitedMarkerEl.setAttribute("class", "color-toggle");
    travelMarkerEl.setAttribute("class", "color-toggle");
    //for every marker in the list, remove it
     
      //update to local Storage
    
  window.localStorage.setItem("visitedObject",JSON.stringify(visitedLocations));
  window.localStorage.setItem("travelObject",JSON.stringify(travelLocations));
  }
/*function removeElement(lowO, highO, lowA, highA){
  //console.log(event.lngLat.lng, event.lngLat.lat)
  //clickedC = event.lngLat.lng, event.lngLat.lat
  let allVisitedCoor = [];
  for (let a=0;a<visitedLocations.features.length;a++){
    let visitCoor = visitedLocations.features[a].geometry.coordinates;
    allVisitedCoor.push(visitCoor);
  }
  if ()
  console.log(visitedLocations.features[0].geometry.coordinates)
  console.log(travelLocations.features[0].geometry.coordinates)
}
/*function findRange (lon, lat){
  let lowerLon = Math.floor(lon);
  let higherLon = Math.ceil(lon);
  let lowerLat = Math.floor(lat);
  let higherLat = Math.ceil(lat);
  removeElement(lowerLon,higherLon,lowerLat,higherLat)
}*/
console.log(markerList)
// USER INTERACTIONS ===============================================================================
//user can see today's date
dateTimeEl.textContent = "Today, " + dayjs().format("dddd, MMMM D, YYYY");
//user can search for a location
//searchButtonEl.addEventListener("click", searchButtonListener);

//when user views website on mobile the map will re-adjust
console.log(map);
map.on("resize", function () {
  map.resize();
});

// user can zoom in/out of the map using button
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, "top-left");

// user can allow the app to locate them
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    // When active the map will receive updates to the device's location as it changes.
    trackUserLocation: true,
    // Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true,
  })
);

map.addControl(new mapboxgl.FullscreenControl());

// Flight API
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "b79d22c47emsh77d61c8e22f2ab4p12dd88jsn0c73dfc004be",
    "X-RapidAPI-Host": "aerodatabox.p.rapidapi.com",
  },
};

//user can click on the map button's to add a marker
visitedMarkerEl.addEventListener("click", visitedListener);
travelMarkerEl.addEventListener("click", travelListener);
removeMarkerEl.addEventListener("dblclick", removeAllListener);
removeMarkerEl.addEventListener("click", removeListener);
map.on("click", addMarker)
/*map.on("click", function(event){
  if (removeToggle){
   // console.log("hey")}
   findRange(event.lngLat.lng, event.lngLat.lat) }
  else{
    addMarker(event)
  }
});*/

// INITIALIZATION ==================================================================================
//finding users coordinates
getCoor();

//reassign values to the variables which hold the pins only if there is data in the local storage
if (localStorage.getItem("visitedObject") !== null) {
  visitedLocations = JSON.parse(localStorage.getItem("visitedObject"));
}
if (localStorage.getItem("travelObject") !== null) {
  travelLocations = JSON.parse(localStorage.getItem("travelObject"));
}

//pins that are stored in the local storage, display them on the map
for (let i = 0; i<visitedLocations.features.length;i++) {
  // create a HTML element for each feature
  const el = document.createElement("div");
  el.className = "marker visited-marker";
  let descriptionList = visitedLocations[i].locationDesc.split(",");
  // make a marker for each feature and add to the map
 let newMarker= new mapboxgl.Marker(el).setLngLat(visitedLocations.features[i].geometry.coordinates).setPopup(
    new mapboxgl.Popup({ offset: 25 }) // add popups
  .setHTML(
    `<h3>${descriptionList[0]}</h3><p>${descriptionList[1] + ", " + descriptionList[2]}</p>` //-------------------------------------------------------------------------------------------------------------------------------------------------------------
  )).addTo(map);
  el.addEventListener("click",function(){
    if (removeToggle){
      console.log(el)
      console.log(visitedLocations);
      el.remove();
      visitedLocations.features.splice(i,1);
      console.log(visitedLocations);
      newMarker.remove();
    }})       
  markerList.push(newMarker);
  
}
for (let i = 0; i<travelLocations.features.length;i++) {
  // create a HTML element for each feature
  const el = document.createElement("div");
  el.className = "marker travel-marker";
  let descriptionList = travelLocations.features[i].locationDesc.split(",");
         
  // make a marker for each feature and add to the map
  let newMarker =new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).setPopup(
    new mapboxgl.Popup({ offset: 25 }) // add popups
  .setHTML(
    `<h3>${descriptionList[0]}</h3><p>${descriptionList[1] + ", " + descriptionList[2]}</p>` //-------------------------------------------------------------------------------------------------------------------------------------------------------------
  )).addTo(map);   
  el.addEventListener("click",function(){
    if (removeToggle){
      console.log(el)
      el.remove();
      console.log(travelLocations);
      travelLocations.features.splice(i,1);
      console.log(travelLocations);
      newMarker.remove();
  }})                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  markerList.push(newMarker);
  //el.addEventListener("dblclick",removeElement(el))
  console.log(markerList)
}
//separate functions between double click and single clickx
//single click function: rem onex
  //caller set to 0 if no item in local storagex
  //id of new marker is = callerx
  //when used--caller increases by onex
  //set it again in local storage after usedx
  //add event listener that  console.log coordinates
  //create an array of the coordinate of the markers
  //finds the coordinates within the array
  //removes from the features