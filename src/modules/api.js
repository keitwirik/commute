const api = {
  url: '/v2/',
  routes: {
    getRoutes: 'getroutes/',
    getDirections: 'getdirections/',
    getStops: 'getstops/',
    getPredictions: 'getpredictions/',
    getTrainpredictions: 't/ttarrivals/',
    getTrainFollow: 't/ttfollow/'
  },
  other: {
    getTrainStopData: 'https://data.cityofchicago.org/resource/8mj8-j3c4.json'
  }
};

export default api;
