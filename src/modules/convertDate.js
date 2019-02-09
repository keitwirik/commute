function convertDate(arrivalTime) {
  var time = new Date(
    [
      arrivalTime.slice(0, 4),
      '/',
      arrivalTime.slice(4, 6),
      '/',
      arrivalTime.slice(6, 8),
      arrivalTime.slice(8)
    ].join('')
  );
  var now = new Date();
  if (time > now) {
    return Math.ceil((time - now) / 1000 / 60); //returns minutes rounded up to arrival time
  }
}

export default convertDate;
