const main = () => {
  console.log('Hello');
};

const convertTime = (p) => {
  // p is a fraction between 0 and 1
  const yearsBack = Math.exp(20.3444 * Math.pow(p, 3) + 3) - Math.exp(3);
  return new Date(new Date() - yearsBack * 365.25 * 24 * 60 * 60 * 1000);
};

// Global stores!
document.addEventListener('alpine:init', () => {
  console.log('Alpine initialized.');

  const defaultTime = 5;
  Alpine.store('time', defaultTime);
  Alpine.store('timerInput', defaultTime);
  Alpine.store('totalTime', defaultTime);
  Alpine.store('proportion', 0);
  Alpine.store('date', '...');

  const timer = new Timer({
    tick: 0.01,
    ontick: (ms) => {
      Alpine.store('time', ms / 1000);
      const p = 1 - ms / 1000 / Alpine.store('totalTime');
      Alpine.store('proportion', p);
      Alpine.store('date', convertTime(p).toISOString());
    },
    onend: () => {
      Alpine.store('time', 0);
      Alpine.store('proportion', 1);
    },
  });
  timer.start(defaultTime).pause();

  window.setTimer = () => {
    const amount = parseFloat(Alpine.store('timerInput'));
    if (!amount) return;
    timer.start(amount).pause();
    Alpine.store('time', amount);
    Alpine.store('totalTime', amount);
    Alpine.store('proportion', 0);
  };
  window.pauseTimer = () => {
    if (timer.getStatus() === 'stopped') return;
    timer.getStatus() === 'started' ? timer.pause() : timer.start();
  };
});
