import "../style/main.css";
import "../fonts/fonts.css";

import { trainLines } from "./modules/trainsArr";
import api from "./modules/api";
import state from "./modules/state";

import convertDate from "./modules/convertDate";
import createRequest from "./modules/createRequest";
// import startTimer from "./modules/startTimer";
import Commute from "./modules/commuteRouter";
// import ListBusRoutesView from './modules/bus_routes/bus_routes';
// import TrainStopsView from './modules/trainstops/trainStops';

// var context,
//   timer,
//   params = {},
//   recentList = [];

// header navigation
const indexNav = document.querySelector(".logo");
indexNav.addEventListener("click", function(e) {
  e.preventDefault();
  console.log("pushing from eventslistener", "/");
  history.pushState(null, null, "/");
  Commute.navigate("/");
});
const busNav = document.querySelector('[data-action="bus"]');
busNav.addEventListener("click", function(e) {
  e.preventDefault();
  console.log("pushing from eventslistener", "/bus");
  history.pushState(null, null, "/bus");
  Commute.navigate("/bus");
});
const trainNav = document.querySelector('[data-action="train"]');
trainNav.addEventListener("click", function(e) {
  e.preventDefault();
  console.log("pushing from eventslistener", "/train");
  history.pushState(null, null, "/train");
  Commute.navigate("/train");
});

(function() {
  var here = window.location.pathname;
  console.log("starting", here);
  Commute.navigate(here);
})();
