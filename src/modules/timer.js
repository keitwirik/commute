import Commute from "../modules/commuteRouter";

const spinner = document.querySelector(".spinner");

const timer = {
  startTimer() {
    timer.stopTimer();
    window.appTimer = setTimeout(function() {
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
    spinner.classList.add("animated");
    Commute.navigate(window.location.pathname);
  },

  stopSpinner() {
    spinner.classList.remove("animated");
  },

  hideSpinner() {
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
