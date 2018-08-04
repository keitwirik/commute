import '../style/main.css';

import { trainsArr, trainLines } from './modules/trainsArr';
import api from './modules/api';
import state from './modules/state';
import render from './modules/render';
import convertDate from './modules/convertDate';
import createRequest from './modules/createRequest';
import startTimer from './modules/startTimer';
import Commute from './modules/commuteRouter';
//import ListBusRoutesView from './modules/bus_routes/bus_routes';
// import TrainStopsView from './modules/trainstops/trainStops';

var context,
  timer,
  params = {},
  recentList = [];

// header navigation
const indexNav = document.querySelector('.navbar-brand');
indexNav.addEventListener('click', function(e) {
  e.preventDefault();
  Commute.navigate('/');
});
const busNav = document.querySelector('[data-action="bus"]');
busNav.addEventListener('click', function(e) {
  e.preventDefault();
  Commute.navigate('/bus');
});
const trainNav = document.querySelector('[data-action="train"]');
trainNav.addEventListener('click', function(e) {
  e.preventDefault();
  Commute.navigate('/train');
});

(function() {
  var here = window.location.pathname;
  console.log('starting', here);
  Commute.navigate(here);
})();

// (function($) {
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
// Commute.Views.BusStopsView = Backbone.View.extend({
//   el: '.info',
//   params: {},
//   events: {
//     'click a.stop': 'navigate'
//   },
//   initialize: function(routeId, direction) {
//     params = {
//       rt: routeId,
//       dir: direction
//     };
//     var that = this;
//     var request = createRequest(api.routes.getStops, params);
//     $('.spinner').hide();
//     clearTimeout(timer);
//     $.get(request, function(data) {
//       that.render(data);
//     });
//   },
//   render: function(data) {
//     context = $.xml2json(data);
//     context.rt = params.rt; //TODO remove after removing from template
//     context.dir = params.direction; //TODO remove after removing from template
//     render('stops', context, this.el);
//   },
//   navigate: function(e) {
//     e.preventDefault();
//     var stpid = $(e.currentTarget).attr('data-stpid');
//     var stpnm = $(e.currentTarget).attr('data-stpnm');
//     params.stop = '/bus/s/' + stpid;
//     params.stopDesc = params.rt + ' ' + params.dir + ' ' + stpnm;
//     params.type = 'bus';
//     addStoredTrip(params);
//     CommuteRouter.navigate('/bus/s/' + stpid, { trigger: true });
//   }
// });
// Commute.Views.BusPredictions = Backbone.View.extend({
//   el: '.info',
//
//   params: {},
//
//   initialize: function(stopId) {
//     bindSpinner(stopId);
//
//     params = { stpid: stopId };
//
//     var that = this;
//
//     var request = createRequest(api.routes.getPredictions, params);
//
//     $.get(request, function(data) {
//       spinner('stop');
//       that.render(data);
//     });
//   },
//
//   render: function(data) {
//     context = $.xml2json(data);
//     context.stpid = params.stpid;
//     //sometimes a single object gets passed back
//     if (context.error) {
//       console.log('there was an error ', context);
//     } else {
//       if (context.prd instanceof Array) {
//         context.prdIsArr = true; // template looks for this
//         for (var i = 0; i < context.prd.length; i++) {
//           context.prd[i].prdtm = convertDate(context.prd[i].prdtm);
//         }
//       } else {
//         context.prd.prdtm = convertDate(context.prd.prdtm);
//       }
//     }
//
//     render('prediction', context, this.el);
//
//     startTimer(params);
//   }
// });
// Commute.Views.TrainPredictionView = Backbone.View.extend({
//   el: '.info',
//   initialize: function(trainline, stopId) {
//     bindSpinner(stopId, trainline);
//
//     var requestRoute = api.routes.getTrainpredictions;
//     this.params = {
//       mapid: stopId,
//       max: 10
//     };
//     this.otherParams = {
//       stpid: stopId,
//       trainline: trainline
//     };
//     var request = createRequest(requestRoute, this.params);
//     var that = this;
//     $.get(request, function(data) {
//       spinner('stop');
//       that.render(data);
//     });
//   },
//   render: function(data) {
//     context = $.xml2json(data);
//     for (var i = 0; i < context.eta.length; i++) {
//       context.eta[i].arrD = convertDate(context.eta[i].arrT);
//     }
//     render('trainpredictions', context, '.info');
//
//     startTimer(this.otherParams);
//   }
// });
// Commute.Views.ListTrainLinesView = Backbone.View.extend({
//   el: '.info',
//   events: {
//     'click a.line': 'navigate'
//   },
//   initialize: function() {
//     this.render();
//   },
//   render: function() {
//     context = {
//       line: trainLines
//     };
//     render('trainlines', context, this.el);
//   },
//   navigate: function(e) {
//     e.preventDefault();
//     line = $(e.currentTarget).data('line');
//     CommuteRouter.navigate('/trains/r/' + line, { trigger: true });
//   }
// });
// function addStoredTrip(params) {
//   if (typeof Storage !== 'undefined') {
//     if (localStorage.getItem('recent') === null) {
//       localStorage.setItem('recent', JSON.stringify(recentList));
//     }
//     recentList = JSON.parse(localStorage.getItem('recent'));
//     recentList.forEach(function(i) {
//       if (i.stop === params.stop) {
//         recentList.splice(recentList.indexOf(i), 1);
//         return false;
//       }
//     });
//     // if not already the most recent then push to recentList
//     recentList.push({ stop: params.stop, stopDesc: params.stopDesc });
//     recentList.length <= 10 || recentList.shift();
//     localStorage.setItem('recent', JSON.stringify(recentList));
//   }
// }
// function getStoredTrips() {
//   if (typeof Storage !== 'undefined') {
//     if (localStorage.getItem('recent') !== null) {
//       recentList = JSON.parse(localStorage.getItem('recent'));
//       render('recent', recentList.reverse(), '.info');
//       //event listeners
//       $('#recent a').on('click', function(e) {
//         e.preventDefault();
//         history.pushState(null, null, $(this).data('url'));
//         Backbone.history.checkUrl();
//         ga(
//           'send',
//           'event',
//           'recentlist',
//           'click',
//           'recent ' + $(this).data('url')
//         );
//       });
//     }
//   }
// }
// function startTimer(params) {
//   var stopId = params.stpid;
//   var type = '';
//   if (params.trainline) {
//     var trainline = params.trainline;
//     type = 'train';
//   } else {
//     type = 'bus';
//   }
//   timer = setTimeout(function() {
//     if (type === 'bus') {
//       new Commute.Views.BusPredictions(stopId);
//     } else {
//       new Commute.Views.TrainPredictionView(trainline, stopId);
//     }
//     ga(
//       'send',
//       'event',
//       'autorefresh',
//       'timer',
//       'autorefresh ' + type + ' ' + window.location.pathname
//     );
//   }, 60000);
// }
// function bindSpinner(stopId, trainline) {
//   var type = '';
//   if (trainline) {
//     type = 'train';
//   } else {
//     type = 'bus';
//   }
//   $('.spinner.' + type).show();
//   spinner('start');
//   // clear timer with any a click
//   $('a').on('click', function() {
//     clearTimeout(timer);
//   });
//
//   $('.spinner.' + type + ' .spin')
//     .off()
//     .on('click', function() {
//       clearTimeout(timer);
//       if (type === 'bus') {
//         new Commute.Views.BusPredictions(stopId);
//       } else {
//         new Commute.Views.TrainPredictionView(trainline, stopId);
//       }
//       ga(
//         'send',
//         'event',
//         'refresh',
//         'click',
//         'refresh ' + type + ' ' + window.location.pathname
//       );
//     });
// }
//
// function spinner(s) {
//   s === 'start' && $('.spin').addClass('animate');
//   s === 'stop' && $('.spin').removeClass('animate');
// }
//
// var CommuteRouter = new Commute.Router();
// Backbone.history.start({ pushState: true });
//
// getStoredTrips();
//
// $('a[data-action]').on('click', function(e) {
//   var action = $(this).data('action');
//   e.preventDefault();
//   CommuteRouter.navigate('/' + action, { trigger: true });
// });
// })(jQuery);
