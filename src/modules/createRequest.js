import api from "./api";

const _encodeData = data =>
  Object.keys(data)
    .map(
      value => encodeURIComponent(value) + "=" + encodeURIComponent(data[value])
    )
    .join("&");

const createRequest = (route, params) =>
  api.url + route + "?" + _encodeData(params);

export default createRequest;
