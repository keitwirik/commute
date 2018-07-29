import api from '../../modules/api';
import startTimer from '../../modules/startTimer';
import state from '../../modules/state';
import createRequest from '../../modules/createRequest';
import addEventListeners from '../../modules/addEventListeners';
import localStorageManager from '../../modules/localStorageManager.js';

var timer;

function trainLines() {
  console.log('trainLines');
  const el = document.createElement('div');
  const trainLines = [
    {
      line_id: 'red',
      line_name: 'Red'
    },
    {
      line_id: 'blue',
      line_name: 'Blue'
    },
    {
      line_id: 'brn',
      line_name: 'Brown'
    },
    {
      line_id: 'g',
      line_name: 'Green'
    },
    {
      line_id: 'p',
      line_name: 'Purple'
    },
    {
      line_id: 'pexp',
      line_name: 'Purple Express'
    },
    {
      line_id: 'y',
      line_name: 'Yellow'
    },
    {
      line_id: 'pnk',
      line_name: 'Pink'
    },
    {
      line_id: 'o',
      line_name: 'Orange'
    }
  ];

  const template = `
  <header>
    <h3>Routes</h3>
  </header>
  <ul class="trains">
    ${trainLines
      .map(
        train => `
          <li>
            <a class="route" href="/train/${train.line_id}" data-rt="${
          train.line_ed
        }">${train.line_name} Line</a>
          </li>
        `
      )
      .join('')}
  </ul>
  `;

  const request = api.other.getTrainStopData;
  localStorageManager.getItem('trainStopData', request);

  el.innerHTML = template;

  addEventListeners(el);

  return document.querySelector('.info').appendChild(el);
}

export default trainLines;
