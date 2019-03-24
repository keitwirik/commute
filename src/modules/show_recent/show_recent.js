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
      <h1 class="heading-1">Recent</h1>
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
          <h1 class="heading-1">No Recent Trips Available</h1>
        </header>
      `
  }
`;

  el.innerHTML = template;

  addEventListeners(el);

  return document.querySelector("#main").appendChild(el);
}

export default showRecent;
