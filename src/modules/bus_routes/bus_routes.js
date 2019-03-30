import api from "../../modules/api";
import createRequest from "../../modules/createRequest";
import addEventListeners from "../../modules/addEventListeners";
import localStorageManager from "../../modules/localStorageManager.js";

function busRoutes() {
  console.log("busroutes");
  const el = document.createElement("div");
  const request = createRequest(api.routes.getRoutes, {});

  localStorageManager.getItem("busRoutesData", request).then(function(data) {
    console.log("busRoutesData returned ", data);

    const buses = data["bustime-response"].routes;

    const template = `
        <header>
          <h1 class="heading-1">Routes</h1>
        </header>
        <ul class="buses">
          ${buses
            .map(
              bus => `
                <li>
                  <a class="cell" href="/bus/${bus.rt}" data-rt="${bus.rt}">${
                bus.rt
              } ${bus.rtnm} </a>
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

export default busRoutes;
