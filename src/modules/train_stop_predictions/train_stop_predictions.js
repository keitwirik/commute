import api from "../../modules/api";
import createRequest from "../../modules/createRequest";
import addEventListeners from "../../modules/addEventListeners";
import localStorageManager from "../../modules/localStorageManager.js";
import { trainColors } from "../../modules/trainsArr.js";

// get line display name from route id
const _convertRouteName = rt => {
  let x = trainColors.find(line => line.line_id === rt.toLowerCase());
  return x.line_name;
};

const _arrivalTimeDisplay = (arrival, apiTime) => {
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
};

function trainStopPredictions(props, callback) {
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

      // array of unique trains lines arriving
      // TODO: pull this from localstorage trainstopdata instead
      let rtArr = [];
      arrivals.forEach(arrival => {
        rtArr.includes(_convertRouteName(arrival.rt)) ||
          rtArr.push(_convertRouteName(arrival.rt));
      });

      const stopInfo = {
        stopName: `${arrivals[0].staNm} ${rtArr.toString()}`,
        path: location.pathname,
        id: arrivals[0].staId // station id not stop id
      };

      // add route to localstorage here
      localStorageManager.pushStopToRecent(stopInfo);
      console.log("add to localstorage", stopInfo);

      const template = `
        <header>
          <h1 class="heading-1">${arrivals[0].staNm} Arrivals</h1>
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
                    ${_arrivalTimeDisplay(arrival, apiTime)}
                    </div>
                  </a>
                </li>
                `
                  : `
                <li class="${arrival.rt}">
                  <div class="route">
                    <div>${arrival.stpDe}</div>
                    <div>
                    ${_arrivalTimeDisplay(arrival, apiTime)}
                    </div>
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
      callback();

      return document.querySelector("#main").appendChild(el);
    });
}

export default trainStopPredictions;
