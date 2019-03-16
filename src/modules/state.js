import Commute from "../modules/commuteRouter";

const state = () => Commute.navigate(window.location.pathname);

window.addEventListener("popstate", state);

export default state;
