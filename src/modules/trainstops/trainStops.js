import Commute from '../../modules/commuteRouter';
import render from '../../modules/render';

Commute.Views.TrainStopsView = Backbone.View.extend({
  el: '.info',
  events: {
    'click a.stop': 'navigate'
  },
  trainline: '',
  initialize: function(trainline) {
    var thisStop, thatStop;
    var context = {
      stoplist: []
    };
    this.trainline = trainline;
    trainsArr.forEach(function(e) {
      if ((thisStop = e[trainline] === 1)) {
        var thisStop = e[7];
        if (thisStop !== thatStop) {
          var tmp = {
            parent_stop_id: e[7],
            stop_name: e[6]
          };
          context.stoplist.push(tmp);
        }
        thatStop = thisStop;
      }
    });

    this.render(context);
  },
  render: function(context) {
    render('trainstops', context, this.el);
  },
  navigate: function(e) {
    var stop;
    var params = {};
    e.preventDefault();
    stop = $(e.currentTarget).data('stop');
    params.stopDesc = $(e.currentTarget).data('desc');
    params.stop = '/trains/r/' + this.trainline + '/s/' + stop;
    params.type = 'train';
    CommuteRouter.navigate('/trains/r/' + this.trainline + '/s/' + stop, {
      trigger: true
    });
    addStoredTrip(params);
  }
});

export default Commute.Views.TrainStopsView;
