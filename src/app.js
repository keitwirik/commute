import "../style/main.css";
import "../fonts/fonts.css";

import Commute from "./modules/commuteRouter";
import localStorageManager from "./modules/localStorageManager";

const appVersion = "2.0";

// header navigation
const indexNav = document.querySelector(".logo");
indexNav.addEventListener("click", function(e) {
  e.preventDefault();
  history.pushState(null, null, "/");
  Commute.navigate("/");
});
const busNav = document.querySelector('[data-action="bus"]');
busNav.addEventListener("click", function(e) {
  e.preventDefault();
  history.pushState(null, null, "/bus");
  Commute.navigate("/bus");
});
const trainNav = document.querySelector('[data-action="train"]');
trainNav.addEventListener("click", function(e) {
  e.preventDefault();
  history.pushState(null, null, "/train");
  Commute.navigate("/train");
});

localStorageManager.checkAppVersion(appVersion);

Commute.navigate(window.location.pathname);
