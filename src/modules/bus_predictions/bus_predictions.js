import api from '../../modules/api';
import startTimer from '../../modules/startTimer';
import state from '../../modules/state';
import createRequest from '../../modules/createRequest';
import addEventListeners from '../../modules/addEventListeners';

var timer;

function busStopPredictions(props) {
  console.log('busStopPredictions props', props);
  const el = document.createElement('div');
  const request = createRequest(api.routes.getPredictions, {
    stpid: props[1]
  });

  fetch(request)
    .then(resp => resp.json())
    .then(data => {
      const predictions = data['bustime-response'].prd;
      const template = `
      <header>
        <h3>#${predictions[0].rt} ${predictions[0].rtdir} ${
        predictions[0].stpnm
      }</h3>
      </header>
      <ul>
        ${predictions
          .map(
            prd => `
              <li>
                  <span class="sm">${prd.rtdir} #${prd.rt} to ${prd.des}</span>
                  <span class="pull-right lg">${prd.prdctdn} min</span>
                  ${prd.dly ? `Delayed` : ``}
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

export default busStopPredictions;
