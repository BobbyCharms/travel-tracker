// DEPENDENCIES (DOM Elements)
let dateTimeEl = document.querySelector("#date-time");
let mapEl = document.querySelector("#map");
let origin = document.querySelector("origin")
let destination = document.querySelector("destination")


let fullMap = document.querySelector("#full-screen-button");



// DATA / STATE / GLOBAL VARIABLES
mapboxgl.accessToken =
  "pk.eyJ1IjoibGFlcnQ5OCIsImEiOiJjbGVkNW1yM2UwMG43M3JwY2dsMjUxYjkyIn0.oODAD95bzzjfRE-Y4DhVLw";
let map = new mapboxgl.Map({
  container: mapEl, // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9, // starting zoom
});
console.log(map);
map.on("resize", function () {
  map.resize();
});
// map.on("load", function () {
//   map.resize();
// });

// Flight API 
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'b79d22c47emsh77d61c8e22f2ab4p12dd88jsn0c73dfc004be',
		'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
	}
};

fetch('https://aerodatabox.p.rapidapi.com/airports/iata/LHR/distance-time/LAX', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));


// FUNCTIONS
// Add event listener to the full screen button
fullMap.addEventListener("click", function(event) {
    // #map element style properties
    mapEl.style.position = "fixed";
    mapEl.style.top = "0";
    mapEl.style.left = "0";
    mapEl.style.width = "100%";
    mapEl.style.height = "100%";
    mapEl.style.zIndex = "9999";
    event.preventDefault()
  });
  

// USER INTERACTIONS

// INITIALIZATION
dateTimeEl.textContent = "Today, " + dayjs().format("dddd, MMMM D, YYYY");
