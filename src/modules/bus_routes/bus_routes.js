import api from '../../modules/api';
import startTimer from '../../modules/startTimer';
import state from '../../modules/state';
import createRequest from '../../modules/createRequest';
import addEventListeners from '../../modules/addEventListeners';

var timer;

function busRoutes() {
  console.log('busroutes');
  const el = document.createElement('div');
  const request = createRequest(api.routes.getRoutes, {});

  fetch(request)
    .then(resp => resp.json())
    .then(function(data) {
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

// Commute.Views.ListBusRoutesView = Backbone.View.extend({
//   el: '.info',
//
//   events: {
//     'click .route': 'navigate'
//   },
//
//   request: createRequest(api.routes.getRoutes, {}),
//
//   initialize: function() {
//     var that = this;
//
//     $('.spinner').hide();
//     clearTimeout(timer);
//
//     $.get(this.request, function(data) {
//       that.render(data);
//     });
//   },
//
//   render: function(data) {
//     render('routes', $.xml2json(data), this.el);
//   },
//
//   navigate: function(e) {
//     e.preventDefault();
//     var rt = $(e.currentTarget).attr('data-rt');
//     CommuteRouter.navigate('/bus/r/' + rt, { trigger: true });
//   }
// });
//
// export default Commute.Views.ListBusRoutesView;
