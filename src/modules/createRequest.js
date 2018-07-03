import api from './api';

function createRequest(requestRoute, params) {
  var request = api.url + requestRoute + '?' + $.param(params);
  return request;
}

export default createRequest;
