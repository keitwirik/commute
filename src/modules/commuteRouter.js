const Commute = {
  Views: {},
  Router: {}
};

Commute.Router = Backbone.Router.extend({
  routes: {
    '': 'index',
    bus: 'getRoutes',
    'bus/r/:routeId': 'getDirections',
    'bus/r/:routeId/:direction': 'getStops',
    'bus/s/:stopId': 'getPrediction',
    trains: 'getTrainlines',
    'trains/r/:trainline': 'getTrainStops',
    'trains/r/:trainline/s/:stopId': 'getTrainPrediction'
  },

  getRoutes: function() {
    new Commute.Views.ListBusRoutesView();
  },

  getDirections: function(routeId) {
    new Commute.Views.BusDirectionsView(routeId);
  },

  getStops: function(routeId, direction) {
    new Commute.Views.BusStopsView(routeId, direction);
  },

  getPrediction: function(stopId) {
    new Commute.Views.BusPredictions(stopId);
  },

  getTrainlines: function() {
    new Commute.Views.ListTrainLinesView();
  },

  getTrainStops: function(trainline) {
    new Commute.Views.TrainStopsView(trainline);
  },

  getTrainPrediction: function(trainline, stopId) {
    new Commute.Views.TrainPredictionView(trainline, stopId);
  }
});

export default Commute;
