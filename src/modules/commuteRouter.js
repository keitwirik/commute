import showRecent from "./show_recent/show_recent";
import busRoutes from "./bus_routes/bus_routes";
import busDirections from "./bus_directions/bus_directions";
import busStops from "./bus_stops/bus_stops";
import busStopPredictions from "./bus_predictions/bus_predictions";
import trainLines from "./train_lines/train_lines";
import trainStops from "./train_stops/train_stops";
import trainStopPredictions from "./train_stop_predictions/train_stop_predictions";
import trainFollow from "./train_follow/train_follow";

var parent = document.querySelector(".info");

const Commute = {
  Views: {},
  Router: {}
};

const busdirection = props => {
  console.log("bus route", props);
};

const routes = {
  home: /^$/,
  busRoutes: /^bus$/,
  busDirections: /^bus\/(\w+)$/,
  busStops: /^bus\/(?!s)(\w+)\/(\w+)$/,
  busStopPredictions: /^bus\/s\/(\w+)$/,
  trainLines: /^train$/,
  trainStops: /^train\/(?!f)(\w+)$/,
  trainStopPredictions: /^train\/(?!f)(\w+)\/(\w+)$/,
  trainFollow: /^train\/f\/(\w+)$/
};

const matchUrl = url => {
  if (url === "") {
    return { function: "home" };
  }
  for (var route in routes) {
    const match = url.match(routes[route]);
    if (match) {
      const everything = {
        function: route,
        props: match
      };
      return everything;
    }
  }
  return "nuthin";
};

Commute.navigate = page => {
  console.log("navigating", page);
  history.pushState(null, null, page);
  page = page.replace(/^\//, "").replace(/\/$/, ""); // shave off slashs
  const next = matchUrl(page);
  console.log("next", next);
  if (next.function) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
  if (next.function === "home") {
    // show recent trips
    console.log("home page");
    showRecent();
  }
  if (next.function === "busRoutes") {
    console.log("bus routes dispatch");
    busRoutes();
  }
  if (next.function === "busDirections" && next.props[1]) {
    console.log("bus directions dispatch", next.props[1]);
    busDirections(next.props[1]);
  }
  if (next.function === "busStops" && next.props[1] && next.props[2]) {
    console.log("busStops dispatch", next.props);
    busStops(next.props);
  }
  if (next.function === "busStopPredictions" && next.props[1]) {
    console.log("busStopPredictions dispatch", next.props);
    busStopPredictions(next.props);
  }
  if (next.function === "trainLines") {
    console.log("train lines dispatch");
    trainLines();
  }
  if (next.function === "trainStops") {
    console.log("train stops dispatch");
    trainStops();
  }
  if (next.function === "trainStopPredictions") {
    console.log("train stop predictions dispatch");
    trainStopPredictions(next.props);
  }
  if (next.function === "trainFollow") {
    console.log("train follow dispatch", next.props);
    trainFollow(next.props);
  }
};

export default Commute;
