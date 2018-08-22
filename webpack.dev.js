const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const request = require('request');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    // https: true,
    contentBase: './dist',
    historyApiFallback: true,

    before: function(app) {
      app.get('/v2/*', function(req, res) {
        // hack to get devserver to pass query string
        let queryString = '?';
        for (let q in req.query) {
          queryString += q + '=' + req.query[q] + '&';
        }
        queryString.slice(0, -1);
        request('http://dev.cta.keit.io/' + req.path + queryString).pipe(res);
      });
    }
  }
});
