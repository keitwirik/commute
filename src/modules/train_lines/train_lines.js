import api from "../../modules/api";
import createRequest from "../../modules/createRequest";
import addEventListeners from "../../modules/addEventListeners";
import localStorageManager from "../../modules/localStorageManager.js";
import { trainColors } from "../../modules/trainsArr.js";

function trainLines() {
  console.log("trainLines");
  const el = document.createElement("div");

  const template = `
  <header>
    <h3>Routes</h3>
  </header>
  <ul class="trains">
    ${trainColors
      .map(
        train => `
          <li>
            <a
              class="route"
              href="/train/${train.line_id}"
              data-rt="${train.line_id}">
              ${train.line_name} Line</a>
          </li>
        `
      )
      .join("")}
  </ul>
  `;

  const request = api.other.getTrainStopData;
  localStorageManager.getItem("trainStopData", request);

  el.innerHTML = template;

  addEventListeners(el);

  return document.querySelector("#main").appendChild(el);
}

export default trainLines;
