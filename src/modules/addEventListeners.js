import state from "../modules/state";
import Commute from "../modules/commuteRouter";

// events
const addEventListeners = el => {
  var links = el.querySelectorAll("a");
  [...links].forEach(link =>
    link.addEventListener("click", function(e) {
      e.preventDefault();
      console.log("pushing from eventslistener", link.pathname);
      history.pushState(null, null, link.pathname);
      // state();
      Commute.navigate(link.pathname);
      console.log("clicked link", link);
    })
  );
};

export default addEventListeners;
