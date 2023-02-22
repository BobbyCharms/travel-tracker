// DEPENDENCIES (DOM Elements) ====================================================================
let dateTimeEl = document.querySelector("#date-time");
let mapEl = document.querySelector("#map");
let searchButtonEl = document.querySelector("#search-button");
let searchInputEl = document.querySelector(".input");
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
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');
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
  

// INITIALIZATION ==================================================================================



// INITIALIZATION
dateTimeEl.textContent = "Today, " + dayjs().format("dddd, MMMM D, YYYY");
