import Commute from "../modules/commuteRouter";

const timer = () => {
  setTimeout(function() {
    console.log("timer");
    Commute.navigate(window.location.pathname);
    // ga(
    //   'send',
    //   'event',
    //   'autorefresh',
    //   'timer',
    //   'autorefresh ' + type + ' ' + window.location.pathname
    // );
  }, 60000);
};

export default timer;
