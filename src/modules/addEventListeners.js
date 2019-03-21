import Commute from "../modules/commuteRouter";
import timer from "./timer";

const _clearMain = () => {
  const el = document.querySelector("#main");
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
};

// events
const addEventListeners = el => {
  var links = el.querySelectorAll("a");
  [...links].forEach(link =>
    link.addEventListener("click", function(e) {
      e.preventDefault();
      console.log("pushing from eventslistener", link.pathname);
      history.pushState(null, null, link.pathname);
      Commute.navigate(link.pathname);
      console.log("clicked link", link);
    })
  );
  timer.hideSpinner();
  _clearMain();
};

export default addEventListeners;
