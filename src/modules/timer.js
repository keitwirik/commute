import Commute from "../modules/commuteRouter";

const spinner = document.querySelector(".spinner");

const timer = {
  startTimer() {
    console.log("start timer");
    timer.stopTimer();
    window.appTimer = setTimeout(function() {
      console.log("timer");
      timer.refresh();
      // ga(
      //   'send',
      //   'event',
      //   'autorefresh',
      //   'timer',
      //   'autorefresh ' + type + ' ' + window.location.pathname
      // );
    }, 60000);

    spinner.removeAttribute("hidden");
  },

  stopTimer() {
    timer.stopSpinner();
    clearTimeout(window.appTimer);
  },

  refresh() {
    console.log("refrase", spinner);
    spinner.classList.add("animated");
    console.log("refrase2", spinner);
    Commute.navigate(window.location.pathname);
  },

  stopSpinner() {
    spinner.classList.remove("animated");
  },

  hideSpinner() {
    console.log("hiding");
    timer.stopSpinner();
    timer.stopTimer();
    spinner.hidden = true;
  }
};

spinner.addEventListener("click", function() {
  timer.stopTimer();
  timer.refresh();
});

export default timer;
