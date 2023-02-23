// DEPENDENCIES (DOM Elements) ====================================================================
let dateTimeEl = document.querySelector("#date-time");
let mapEl = document.querySelector("#map");
let searchButtonEl = document.querySelector("#search-button");
let searchInputEl = document.querySelector(".input");


let origin = document.querySelector("#origin")
let destination = document.querySelector("#destination")
// DATA / STATE / GLOBAL VARIABLES
mapboxgl.accessToken =
  "pk.eyJ1IjoibGFlcnQ5OCIsImEiOiJjbGVkNW1yM2UwMG43M3JwY2dsMjUxYjkyIn0.oODAD95bzzjfRE-Y4DhVLw";
let map = new mapboxgl.Map({
  container: mapEl, // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9, // starting zoom
});


//FUNCTIONS ========================================================================================
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
      map.flyTo({
        center: data.features[0].center,
        speed: 0.7
      });
    });
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

// Full screen map button
map.addControl(new mapboxgl.FullscreenControl());


//Add markers array
const markers = [];

// Adding new markers
map.on('click', function(e) {
    const marker = new mapboxgl.Marker()
    .setLngLat(e.lngLat)
    .addTo(map);


// Remove markers
    marker.getElement().addEventListener('dblclick', function() {
         const index = markers.indexOf(marker);
     if (index !== -1) {
         markers.splice(index, 1);}
    marker.remove();
 });
 }); 




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


  

// INITIALIZATION ==================================================================================



