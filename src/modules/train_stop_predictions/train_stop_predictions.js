import api from "../../modules/api";
import startTimer from "../../modules/startTimer";
import state from "../../modules/state";
import createRequest from "../../modules/createRequest";
import addEventListeners from "../../modules/addEventListeners";
import localStorageManager from "../../modules/localStorageManager.js";
import { trainColors } from "../../modules/trainsArr.js";

var timer;
console.log("hhh", trainColors);

function arrivalTimeDisplay(arrival, apiTime) {
  console.log("a a", new Date(arrival.arrT), apiTime);
  var display = "";
  if (arrival.isApp !== "0") {
    display = "Due";
  } else if (arrival.isDly !== "0") {
    display = "Delayed";
  } else {
    display = `${Math.ceil(
      (new Date(arrival.arrT) - apiTime) / 1000 / 60
    )} min ${arrival.isSch !== "0" ? "*" : ""}`;
  }
  return display;
}

function trainStopPredictions(props) {
  console.log("trainStopPredictions", props);
  const el = document.createElement("div");

  const request = createRequest(api.routes.getTrainpredictions, {
    mapid: props[2]
  });

  fetch(request)
    .then(resp => resp.json())
    .then(data => {
      const mapId = location.pathname.split("/")[2];

      const arrivals = data.ctatt.eta;
      const apiTime = new Date(data.ctatt.tmst);

      const convertRouteName = rt => {
        let x = trainColors.find(line => line.line_id === rt.toLowerCase());
        return x.line_name;
      };

      console.log(arrivals);
      // add route to localstorage here
      let rtArr = [];
      arrivals.forEach(arrival => {
        rtArr.includes(convertRouteName(arrival.rt)) ||
          rtArr.push(convertRouteName(arrival.rt));
        console.log("c", rtArr, arrival.rt, convertRouteName(arrival.rt));
      });

      const stopInfo = {
        stopName: `${arrivals[0].staNm} ${rtArr.toString()}`,
        path: location.pathname,
        stopId: arrivals[0].stpId
      };
      console.log("add to localstorage", stopInfo);
      const template = `
        <header>
          <h3>${arrivals[0].staNm} Arrivals</h3>
        </header>
        <ul class="trains">
          ${arrivals
            .map(
              arrival => `
              ${
                arrival.isSch === "0"
                  ? `
                <li class="${arrival.rt}">
                  <a
                    class="route"
                    href="/train/f/${arrival.rn}"
                    data-rt="${arrival.rn}">
                    <div>${arrival.stpDe}</div>
                    <div>
                    ${arrivalTimeDisplay(arrival, apiTime)}
                    </div>
                  </a>
                </li>
                `
                  : `
                <li class="${arrival.rt}">
                  <div>${arrival.stpDe}</div>
                  <div>
                  ${arrivalTimeDisplay(arrival, apiTime)}
                  </div>
                </li>
                `
              }
              `
            )
            .join("")}
        </ul>
      `;

      el.innerHTML = template;

      addEventListeners(el);

      return document.querySelector(".info").appendChild(el);
    });
}

export default trainStopPredictions;
