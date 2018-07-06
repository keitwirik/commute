const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const request = require('request');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,

    before: function(app) {
      app.get('/v2/*', function(req, res) {
        request('http://dev.cta.keit.io/' + req.path).pipe(res);
      });
    }
  }
});
