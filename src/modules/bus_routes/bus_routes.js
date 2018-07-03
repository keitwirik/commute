import Commute from '../../modules/commuteRouter';
import api from '../../modules/api';
import render from '../../modules/render';
import createRequest from '../../modules/createRequest';

var timer;
Commute.Views.ListBusRoutesView = Backbone.View.extend({
  el: '.info',

  events: {
    'click .route': 'navigate'
  },

  request: createRequest(api.routes.getRoutes, {}),

  initialize: function() {
    var that = this;

    $('.spinner').hide();
    clearTimeout(timer);

    $.get(this.request, function(data) {
      that.render(data);
    });
  },

  render: function(data) {
    render('routes', $.xml2json(data), this.el);
  },

  navigate: function(e) {
    e.preventDefault();
    var rt = $(e.currentTarget).attr('data-rt');
    CommuteRouter.navigate('/bus/r/' + rt, { trigger: true });
  }
});

export default Commute.Views.ListBusRoutesView;
