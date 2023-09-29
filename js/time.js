/*
  Convert epoch numbers to readable dates
*/

const convertTime = (p) => {
  // p is a fraction between 0 and 1
  const yearsBack = Math.exp(20.3444 * Math.pow(p, 3) + 3) - Math.exp(3);
  return new Date(new Date() - yearsBack * 365.25 * 24 * 60 * 60 * 1000);
};
