/*
  Convert epoch numbers to readable dates
*/

const convertTime = (p) => {
  // p is a fraction between 0 and 1
  const yearsBack = Math.exp(20.3444 * Math.pow(p, 3) + 3) - Math.exp(3);
  const date = new Date(new Date() - yearsBack * 365.25 * 24 * 60 * 60 * 1000);

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};
