import api from "../../modules/api";
import createRequest from "../../modules/createRequest";
import addEventListeners from "../../modules/addEventListeners";

function busStops(props, callback) {
  console.log("busStops props", props);
  const el = document.createElement("div");
  const request = createRequest(api.routes.getStops, {
    rt: props[1],
    dir: props[2]
  });

  fetch(request)
    .then(resp => resp.json())
    .then(data => {
      const stops = data["bustime-response"].stops;
      const template = `
      <header>
        <h1 class="heading-1">Stops</h1>
      </header>
      <ul>
        ${stops
          .map(
            stop => `
              <li>
                <a
                class="cell"
                href="/bus/s/${stop.stpid}"
                data-stop="${stop.stpid}">${stop.stpnm}</a>
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

export default busStops;
