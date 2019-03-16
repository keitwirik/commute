import api from "../../modules/api";
import state from "../../modules/state";
import createRequest from "../../modules/createRequest";
import addEventListeners from "../../modules/addEventListeners";
import localStorageManager from "../../modules/localStorageManager.js";

function showRecent() {
  const el = document.createElement("div");
  const recentList = localStorageManager.getRecent();

  const template = `
  ${
    recentList
      ? `
    <header>
      <h3>Recent</h3>
    </header>
    <ul>
      ${recentList
        .map(
          item => `
            <li>
              <a
              class="route"
              href="${item.path}"
              data-stop="${item.id}">${item.stopName}</a>
            </li>
          `
        )
        .join("")}
      </ul>
      `
      : `
        <header>
          <h3>No Recent Trips Available</h3>
        </header>
      `
  }
`;

  el.innerHTML = template;

  addEventListeners(el);

  return document.querySelector(".info").appendChild(el);
}

export default showRecent;
