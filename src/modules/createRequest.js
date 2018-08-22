import api from './api';

function createRequest(route, params) {
  return (
    api.url +
    route +
    '?' +
    Object.keys(params)
      .map(value => {
        return (
          encodeURIComponent(value) + '=' + encodeURIComponent(params[value])
        );
      })
      .join('&')
  );
}

export default createRequest;
