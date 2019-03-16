import showRecent from "./show_recent/show_recent";
import busRoutes from "./bus_routes/bus_routes";
import busDirections from "./bus_directions/bus_directions";
import busStops from "./bus_stops/bus_stops";
import busStopPredictions from "./bus_predictions/bus_predictions";
import trainLines from "./train_lines/train_lines";
import trainStops from "./train_stops/train_stops";
import trainStopPredictions from "./train_stop_predictions/train_stop_predictions";
import trainFollow from "./train_follow/train_follow";
import timer from "./timer.js";

const _clearMain = () => {
  const el = document.querySelector("#main");
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
};

const _matchUrl = url => {
  if (url === "") {
    return { name: "home" };
  }
  for (let route in Commute.routes) {
    const match = url.match(Commute.routes[route]);
    if (match) {
      const everything = {
        name: route,
        props: match
      };
      return everything;
    }
  }
  return "nuthin";
};

const Commute = {};

Commute.routes = {
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

Commute.navigate = page => {
  const route = _matchUrl(page.replace(/^\//, "").replace(/\/$/, "")); // shave off beginning and ending slashes
  console.log("route", route);
  if (route.name) {
    _clearMain();

    switch (route.name) {
      case "home":
        showRecent();
        break;
      case "busRoutes":
        busRoutes();
        break;
      case "trainLines":
        trainLines();
        break;
      case "trainStops":
        trainStops();
        break;
      case "trainStopPredictions":
        trainStopPredictions(route.props, timer);
        break;
      case "trainFollow":
        trainFollow(route.props);
        break;
      case "busDirections":
        if (route.props[1]) {
          busDirections(route.props[1]);
        }
        break;
      case "busStops":
        if (route.props[1] && route.props[2]) {
          busStops(route.props);
        }
        break;
      case "busStopPredictions":
        if (route.props[1]) {
          busStopPredictions(route.props, timer);
        }
        break;
      default:
        console.error(route.name + " didn't fit anything", route);
    }
  }
};

export default Commute;
