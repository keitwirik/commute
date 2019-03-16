import api from "../../modules/api";
import createRequest from "../../modules/createRequest";
import addEventListeners from "../../modules/addEventListeners";
import localStorageManager from "../../modules/localStorageManager.js";

function filterArrayForDistinctValues(arr, distinctValueKey) {
  let distArr = [];
  arr.map(item => {
    const filterArr = distArr.filter(
      distItem => distItem[distinctValueKey] === item[distinctValueKey]
    );
    filterArr.length === 0 && distArr.push(item);
  });
  return distArr;
}

function trainStops() {
  console.log("trainStops");
  const el = document.createElement("div");

  const request = api.other.getTrainStopData;
  localStorageManager.getItem("trainStopData", request).then(function(data) {
    const trainLine = location.pathname.split("/")[2];

    const trainStops = data.filter(stop => stop[trainLine]);

    const trainParentStops = filterArrayForDistinctValues(trainStops, "map_id");

    console.log(trainParentStops);

    const template = `
        <header>
          <h3>Routes</h3>
        </header>
        <ul class="trains">
          ${trainParentStops
            .map(
              stop => `
                <li>
                  <a
                    class="route"
                    href="/train/s/${stop.map_id}"
                    data-rt="${stop.map_id}">
                    ${stop.station_descriptive_name}</a>
                </li>
              `
            )
            .join("")}
        </ul>
        `;

    el.innerHTML = template;

    addEventListeners(el);

    return document.querySelector("#main").appendChild(el);
  });
}

export default trainStops;
