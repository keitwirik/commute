import busRoutes from './bus_routes/bus_routes';
import busDirections from './bus_directions/bus_directions';

var parent = document.querySelector('.info');

const Commute = {
  Views: {},
  Router: {}
};

const busdirection = props => {
  console.log('bus route', props);
};

const routes = {
  home: /^$/,
  busRoutes: /^bus$/,
  busDirections: /^bus\/(\w+)$/,
  busStopPredictions: /^bus\/(\w+)\/(\w+)$/,
  trainLines: /^trains$/,
  trainStops: /^trains\/(\w+)$/,
  trainStopPredictions: /^trains\/(\w+)\/(\w+)$/
};

const matchUrl = url => {
  if (url === '') {
    return { function: 'home' };
  }
  for (var route in routes) {
    const match = url.match(routes[route]);
    if (match) {
      const everything = {
        function: route,
        props: match
      };
      return everything;
    }
  }
  return 'nuthin';
};

Commute.navigate = page => {
  console.log('navigating', page);
  history.pushState(null, null, page);
  page = page.replace(/^\//, '').replace(/\/$/, ''); // shave off slashs
  const next = matchUrl(page);
  console.log('next', next);
  if (next.function === 'home') {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    // show recent trips
    console.log('home page');
  }
  if (next.function === 'busRoutes') {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    console.log('bus routes dispatch');
    busRoutes();
  }
  if (next.function === 'busDirections' && next.props[1]) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    console.log('bus directions dispatch', next.props[1]);
    busDirections(next.props[1]);
  }
};

//let url = '/bus/r/5/north/'; // starting path
//url = url.replace(/^\//, '').replace(/\/$/, ''); // shave off slashes

//navigate(); //do this on url change

// Commute.Router = Backbone.Router.extend({
//   routes: {
//     '': 'index',
//     bus: 'getRoutes',
//     'bus/r/:routeId': 'getDirections',
//     'bus/r/:routeId/:direction': 'getStops',
//     'bus/s/:stopId': 'getPrediction',
//     trains: 'getTrainlines',
//     'trains/r/:trainline': 'getTrainStops',
//     'trains/r/:trainline/s/:stopId': 'getTrainPrediction'
//   },
//
// getRoutes: function() {
//   //new Commute.Views.ListBusRoutesView();
//   while (parent.firstChild) {
//     parent.removeChild(parent.firstChild);
//   }
//   busRoutes();
// },
//
//   getDirections: function(routeId) {
//     // new Commute.Views.BusDirectionsView(routeId);
//     while (parent.firstChild) {
//       parent.removeChild(parent.firstChild);
//     }
//     busDirections();
//   },
//
//   getStops: function(routeId, direction) {
//     new Commute.Views.BusStopsView(routeId, direction);
//   },
//
//   getPrediction: function(stopId) {
//     new Commute.Views.BusPredictions(stopId);
//   },
//
//   getTrainlines: function() {
//     new Commute.Views.ListTrainLinesView();
//   },
//
//   getTrainStops: function(trainline) {
//     new Commute.Views.TrainStopsView(trainline);
//   },
//
//   getTrainPrediction: function(trainline, stopId) {
//     new Commute.Views.TrainPredictionView(trainline, stopId);
//   }
//  });

export default Commute;
