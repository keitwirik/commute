import api from "../../modules/api";
import createRequest from "../../modules/createRequest";
import addEventListeners from "../../modules/addEventListeners";

function busDirections(routeId) {
  const el = document.createElement("div");
  const request = createRequest(api.routes.getDirections, { rt: routeId });

  fetch(request)
    .then(resp => resp.json())
    .then(data => {
      const directions = data["bustime-response"].directions.map(bus => ({
        dir: bus.dir,
        rt: routeId
      }));
      const template = `
      <header>
        <h1 class="heading-1">${routeId} Directions</h1>
      </header>
      <ul>
        ${directions
          .map(
            direction => `
              <li>
                <a
                class="cell"
                href="/bus/${direction.rt}/${direction.dir}"
                data-dir="${direction.dir}"
                data-rt="${direction.rt}">${direction.dir}</a>
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

export default busDirections;
