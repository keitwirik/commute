import api from "../../modules/api";
import createRequest from "../../modules/createRequest";
import addEventListeners from "../../modules/addEventListeners";

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

function trainFollow(props) {
  console.log("trainFollow", props);
  const el = document.createElement("div");

  const request = createRequest(api.routes.getTrainFollow, {
    runnumber: props[1]
  });

  fetch(request)
    .then(resp => resp.json())
    .then(data => {
      console.log("err", data.ctatt.errCd, data.ctatt.errCd === "502");
      if (data.ctatt.errCd === "502") {
        el.innerHTML = `<header><h1 class="heading-1">${data.ctatt.errNm}</h1></header>`;
        return document.querySelector("#main").appendChild(el);
      }

      const arrivals = data.ctatt.eta;
      const apiTime = new Date(data.ctatt.tmst);

      console.log(arrivals);

      const template = `
        <header>
          <h1 class="heading-1">
          ${arrivals[0].rt} Run #${arrivals[0].rn} Toward ${arrivals[0].destNm}
          </h1>
        </header>
        <ul class="trains">
          ${arrivals
            .map(
              arrival => `
                <li class="${arrival.rt}">
                  <a
                    class="cell"
                    href="/train/s/${arrival.staId}"
                    data-rt="${arrival.rt}">
                    <div>
                      ${
                        arrival.staNm === arrival.destNm
                          ? `
                        ${arrival.staNm}
                        `
                          : `
                        ${arrival.staNm} toward ${arrival.destNm}
                        `
                      }
                    </div>
                    <div>
                    ${arrivalTimeDisplay(arrival, apiTime)}
                    </div>
                  </a>
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

export default trainFollow;
