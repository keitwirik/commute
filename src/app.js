import "../style/main.css";
import "../fonts/fonts.css";

import Commute from "./modules/commuteRouter";
import localStorageManager from "./modules/localStorageManager";
import addEventListeners from "./modules/addEventListeners";

const appVersion = "2.0";

const state = () => Commute.navigate(window.location.pathname);

// init app
//check if app is up to date
localStorageManager.checkAppVersion(appVersion);

// set up main navigation
addEventListeners(document.querySelector(".page-header nav"));

// listen for back button
window.addEventListener("popstate", state);

// start app by triggering navigation
state();
