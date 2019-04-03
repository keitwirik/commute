import Commute from "../modules/commuteRouter";

const state = () => {
  console.log("popstate");
  Commute.navigate(window.location.pathname);
};

window.addEventListener("popstate", state);

export default state;
