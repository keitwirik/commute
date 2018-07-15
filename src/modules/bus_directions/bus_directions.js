import api from '../../modules/api';
import startTimer from '../../modules/startTimer';
import state from '../../modules/state';
import createRequest from '../../modules/createRequest';

var timer;

function busDirections(routeId) {
  const el = document.createElement('div');
  const request = createRequest(api.routes.getDirections, { rt: routeId });

  fetch(request)
    .then(resp => resp.json())
    .then(data => {
      const directions = data['bustime-response'].directions.map(bus => ({
        dir: bus.dir,
        rt: routeId
      }));
      const template = `
      <header>
        <h3>${routeId} Directions</h3>
      </header>
      <ul>
        ${directions
          .map(
            direction => `
              <li>
                <a
                class="direction"
                href="/bus/${direction.rt}/${direction.dir}"
                data-dir="${direction.dir}"
                data-rt="${direction.rt}">${direction.dir}</a>
              </li>
            `
          )
          .join('')}
      </ul>
    `;

      el.innerHTML = template;

      // events
      var links = el.querySelectorAll('a');
      [...links].forEach(link =>
        link.addEventListener('click', function(e) {
          e.preventDefault();
          history.pushState(null, null, link.href);
          state();
          console.log('clicked link', link);
        })
      );

      return document.querySelector('.info').appendChild(el);
    });
}

export default busDirections;

// Commute.Views.BusDirectionsView = Backbone.View.extend({
//   //FIXME: possible for route to hav only one direction
//   // and return an obj instead of an array
//   // This should just get passed over with the single route possible
//   el: '.info',
//
//   params: {},
//
//   events: {
//     'click a.direction': 'navigate'
//   },
//
//   initialize: function(routeId) {
//     params.rt = routeId;
//     var request = createRequest(api.routes.getDirections, params);
//
//     var that = this;
//
//     $('.spinner').hide();
//     clearTimeout(timer);
//
//     $.get(request, function(data) {
//       that.render(data);
//     });
//   },
//
//   render: function(data) {
//     context = $.xml2json(data);
//     context.rt = params.rt; //TODO remove this after removing it from template
//     if (context.dir instanceof Array) {
//       context.dirIsArr = true;
//     }
//     render('directions', context, this.el);
//   },
//
//   navigate: function(e) {
//     e.preventDefault();
//     var direction = $(e.currentTarget).attr('data-dir');
//     CommuteRouter.navigate('/bus/r/' + params.rt + '/' + direction, {
//       trigger: true
//     });
//   }
// });
