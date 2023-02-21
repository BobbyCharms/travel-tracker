// DEPENDENCIES (DOM Elements)
let dateTimeEl = document.querySelector("#date-time");


// DATA / STATE / GLOBAL VARIABLES


// FUNCTIONS


// USER INTERACTIONS


// INITIALIZATION
dateTimeEl.textContent = "Today, " + dayjs().format('dddd, MMMM D, YYYY');