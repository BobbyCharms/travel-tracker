// DEPENDENCIES (DOM Elements)
let dateTimeEl = document.querySelector("#date-time");
let mapEl = document.querySelector("#map");


// DATA / STATE / GLOBAL VARIABLES
mapboxgl.accessToken = 'pk.eyJ1IjoibGFlcnQ5OCIsImEiOiJjbGVkNW1yM2UwMG43M3JwY2dsMjUxYjkyIn0.oODAD95bzzjfRE-Y4DhVLw';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
});

// FUNCTIONS


// USER INTERACTIONS


// INITIALIZATION
dateTimeEl.textContent = "Today, " + dayjs().format('dddd, MMMM D, YYYY');

map.addControl(new mapboxgl.NavigationControl());
new mapboxgl.Marker()
.setLngLat([-74.5, 40])
.addTo(map);

