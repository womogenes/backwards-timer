const main = () => {
  console.log('Hello');
};

// Global stores!
document.addEventListener('alpine:init', () => {
  console.log('Alpine initialized.');

  const defaultTime = 60;
  Alpine.store('time', defaultTime);
  Alpine.store('timerInput', defaultTime);

  const timer = new Timer({
    tick: 0.01,
    ontick: (ms) => Alpine.store('time', ms / 1000),
    onend: () => Alpine.store('time', 0),
  });
  timer.start(defaultTime).pause();

  window.setTimer = () => {
    const amount = parseFloat(Alpine.store('timerInput'));
    if (!amount) return;
    timer.start(amount).pause();
    Alpine.store('time', amount);
  };
  window.pauseTimer = () =>
    timer.getStatus() === 'started' ? timer.pause() : timer.start();
});
