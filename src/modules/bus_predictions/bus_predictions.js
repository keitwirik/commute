import api from "../../modules/api";
import createRequest from "../../modules/createRequest";
import addEventListeners from "../../modules/addEventListeners";
import timer from "../../modules/timer";

function busStopPredictions(props, callback) {
  console.log("busStopPredictions props", props);
  const el = document.createElement("div");
  const request = createRequest(api.routes.getPredictions, {
    stpid: props[1]
  });

  fetch(request)
    .then(resp => resp.json())
    .then(data => {
      const predictions = data["bustime-response"].prd;
      const template = `
      <header>
        <h1 class="heading-1">#${predictions[0].rt} ${predictions[0].rtdir} ${
        predictions[0].stpnm
      }</h1>
      </header>
      <ul>
        ${predictions
          .map(
            prd => `
              <li class="cell">
                  <div>${prd.rtdir} #${prd.rt} to ${prd.des}</div>
                  <div class="arrivalTime">${
                    prd.dly
                      ? `Delayed`
                      : `${
                          prd.prdctdn === "DUE"
                            ? `${prd.prdctdn}`
                            : `${prd.prdctdn} min`
                        } </div>
                  ${prd.dly ? `Delayed` : ``}
                  `
                  }
              </li>
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

export default busStopPredictions;
