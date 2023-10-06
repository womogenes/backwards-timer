/*
  Convert epoch numbers to readable dates
*/

// https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
Number.prototype.toHHMMSS = function () {
  let n = this;
  let days = Math.floor(n / (3600 * 24));
  n -= days * 3600 * 24;
  let hours = Math.floor(n / 3600);
  n -= hours * 3600;
  let minutes = Math.floor(n / 60);
  n -= minutes * 60;
  let seconds = n.toFixed(2);

  if (hours < 10) hours = '0' + hours;
  if (minutes < 10) minutes = '0' + minutes;
  if (seconds < 10) seconds = '0' + seconds;
  return (days ? `${days} days, ` : '') + `${hours}:${minutes}:${seconds}`;
};

const msInYear = 365.25 * 24 * 60 * 60 * 1000;

const strToEpoch = (str) => {
  // Convert a date like "2023-09-09" or "-44-03-15" to an epoch
  let parts;
  if (str.startsWith('-')) {
    parts = str
      .substring(1)
      .split('-')
      .map((x) => parseInt(x));
    parts[0] *= -1;
  } else {
    parts = str.split('-').map((x) => parseInt(x));
  }
  console.log(parts);
  return new Date(...parts);
};

const propToEpoch = (p) => {
  // p is a fraction between 0 and 1
  const yearsBack = Math.exp(20.3444 * Math.pow(p, 3) + 3) - Math.exp(3);
  const epoch = new Date() - yearsBack * msInYear;
  return epoch;
};

const epochToStr = (epoch) => {
  yearsBack = (new Date() - epoch) / msInYear;

  if (yearsBack > new Date().getFullYear()) {
    return `${yearsBack.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    })} years ago`;
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

const epochToStrShort = (epoch) => {
  let yearsBack = (new Date() - epoch) / msInYear;

  if (yearsBack < 1) {
    if (yearsBack < 0.001) return 'Now';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
    }).format(new Date(epoch));
  }
  if (yearsBack < new Date().getFullYear() - 1) {
    // Between 1 AD and the present
    const year = new Date(epoch).getFullYear();
    return year < 1000 ? `${year} CE` : year;
  }

  // Function to round an integer to 3 sig figs
  const toSigFigs = (x, n) => parseFloat(x.toPrecision(n));
  const addCommas = (x) =>
    x.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    });

  if (yearsBack < 1e6) {
    // Format as "thousands"
    return `${addCommas(toSigFigs(yearsBack, 2))} years&nbsp;ago`;
  }
  if (yearsBack < 1e9) {
    // Format as "millions"
    return `${toSigFigs(yearsBack / 1e6, 3)} M years&nbsp;ago`;
  }
  if (yearsBack < 1e12) {
    // Format as "billions"
    return `${toSigFigs(yearsBack / 1e9, 3)} B years&nbsp;ago`;
  }
};
