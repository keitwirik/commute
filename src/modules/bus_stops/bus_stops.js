import api from '../../modules/api';
import startTimer from '../../modules/startTimer';
import state from '../../modules/state';
import createRequest from '../../modules/createRequest';
import addEventListeners from '../../modules/addEventListeners';

var timer;

function busStops(props) {
  console.log('busStops props', props);
  const el = document.createElement('div');
  const request = createRequest(api.routes.getStops, {
    rt: props[1],
    dir: props[2]
  });

  fetch(request)
    .then(resp => resp.json())
    .then(data => {
      const stops = data['bustime-response'].stops;
      const template = `
      <header>
        <h3>Stops</h3>
      </header>
      <ul>
        ${stops
          .map(
            stop => `
              <li>
                <a
                class="direction"
                href="/bus/s/${stop.stpid}"
                data-stop="${stop.stpid}">${stop.stpnm}</a>
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

export default busStops;

// Commute.Views.BusStopsView = Backbone.View.extend({
//   el: '.info',
//   params: {},
//   events: {
//     'click a.stop': 'navigate'
//   },
//   initialize: function(routeId, direction){
//     params = {
//       "rt" : routeId,
//       "dir" : direction
//     };
//     var that = this;
//     var request = createRequest(api.routes.getStops, params);
//     $('.spinner').hide();
//     clearTimeout(timer);
//     $.get(request, function(data){
//       that.render(data);
//     });
//   },
//   render: function(data){
//     context = $.xml2json(data);
//     context.rt = params.rt; //TODO remove after removing from template
//     context.dir = params.direction;  //TODO remove after removing from template
//     render('stops', context, this.el);
//   },
//   navigate: function(e){
//     e.preventDefault();
//     var stpid = $(e.currentTarget).attr('data-stpid');
//     var stpnm = $(e.currentTarget).attr('data-stpnm');
//     params.stop = '/bus/s/' + stpid;
//     params.stopDesc = params.rt + ' ' + params.dir + ' ' + stpnm;
//     params.type = 'bus';
//     addStoredTrip(params);
//     CommuteRouter.navigate('/bus/s/' + stpid, {trigger: true});
//   }
//
// });
