/*
  Convert epoch numbers to readable dates
*/

// https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
Number.prototype.toHHMMSS = function () {
  var hours = Math.floor(this / 3600);
  var minutes = Math.floor((this - hours * 3600) / 60);
  var seconds = (this - hours * 3600 - minutes * 60).toFixed(2);

  if (hours < 10) hours = '0' + hours;
  if (minutes < 10) minutes = '0' + minutes;
  if (seconds < 10) seconds = '0' + seconds;
  return `${hours}:${minutes}:${seconds}`;
};

const convertTime = (p) => {
  // p is a fraction between 0 and 1
  const yearsBack = Math.exp(20.3444 * Math.pow(p, 3) + 3) - Math.exp(3);
  const epoch = new Date() - yearsBack * 365.25 * 24 * 60 * 60 * 1000;

  if (yearsBack >= 2e5) {
    return `${yearsBack.toPrecision(3)} years ago`;
  }

  const date = new Date(epoch);
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: 'numeric',
    fractionalSecondDigits: 3,
    hour12: true,
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};
