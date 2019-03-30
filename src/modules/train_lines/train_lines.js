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
    <h1 class="heading-1">Routes</h1>
  </header>
  <ul class="trains">
    ${trainColors
      .map(
        train => `
          <li>
            <a
              class="cell"
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
