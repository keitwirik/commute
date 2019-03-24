import "../style/main.css";
import "../fonts/fonts.css";

import Commute from "./modules/commuteRouter";
import localStorageManager from "./modules/localStorageManager";

const appVersion = "2.0";

// main navigation
document.querySelector('.page-header nav')
  .querySelectorAll('a').forEach(a => {
    a.addEventListener('click', function(e) {
      const path = a.attributes.href.nodeValue;
      e.preventDefault();
      history.pushState(null, null, path );
      Commute.navigate(path);
    })
});

localStorageManager.checkAppVersion(appVersion);

Commute.navigate(window.location.pathname);
