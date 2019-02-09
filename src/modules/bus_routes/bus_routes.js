import api from '../../modules/api';
import startTimer from '../../modules/startTimer';
import state from '../../modules/state';
import createRequest from '../../modules/createRequest';
import addEventListeners from '../../modules/addEventListeners';
import localStorageManager from '../../modules/localStorageManager.js';

var timer;

function busRoutes() {
  console.log('busroutes');
  const el = document.createElement('div');
  const request = createRequest(api.routes.getRoutes, {});

  localStorageManager.getItem('busRoutesData', request).then(function(data) {
    console.log('busRoutesData returned ', data);

    const buses = data['bustime-response'].routes;

    const template = `
        <header>
          <h3>Routes</h3>
        </header>
        <ul class="buses">
          ${buses
            .map(
              bus => `
                <li>
                  <a class="route" href="/bus/${bus.rt}" data-rt="${bus.rt}">${
                bus.rt
              } ${bus.rtnm} </a>
                </li>
              `
            )
            .join('')}
        </ul>
      `;

    el.innerHTML = template;

    addEventListeners(el);

    return document.querySelector('.info').appendChild(el);
  });
}

export default busRoutes;
