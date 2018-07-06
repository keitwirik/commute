function startTimer(params) {
  var stopId = params.stpid;
  var type = '';
  if (params.trainline) {
    var trainline = params.trainline;
    type = 'train';
  } else {
    type = 'bus';
  }
  timer = setTimeout(function() {
    if (type === 'bus') {
      new Commute.Views.BusPredictions(stopId);
    } else {
      new Commute.Views.TrainPredictionView(trainline, stopId);
    }
    ga(
      'send',
      'event',
      'autorefresh',
      'timer',
      'autorefresh ' + type + ' ' + window.location.pathname
    );
  }, 60000);
}

export default startTimer;
