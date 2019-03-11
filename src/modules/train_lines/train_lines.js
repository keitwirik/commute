import api from "../../modules/api";
import startTimer from "../../modules/startTimer";
import state from "../../modules/state";
import createRequest from "../../modules/createRequest";
import addEventListeners from "../../modules/addEventListeners";
import localStorageManager from "../../modules/localStorageManager.js";
import { trainColors } from "../../modules/trainsArr.js";

var timer;

function trainLines() {
  console.log("trainLines");
  const el = document.createElement("div");

  const template = `
  <header>
    <h3>Routes</h3>
  </header>
  <ul class="trains">
    ${trainLines
      .map(
        train => `
          <li>
            <a
              class="route"
              href="/train/${train.line_id}"
              data-rt="${train.line_ed}">
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

  return document.querySelector(".info").appendChild(el);
}

export default trainLines;
