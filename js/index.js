const main = () => {
  console.log('Hello');
};

// Global stores!
document.addEventListener('alpine:init', () => {
  console.log('Alpine initialized.');

  const defaultTime = 60 * 10;
  Alpine.store('time', {
    time: defaultTime,
    totalTime: defaultTime,
    get proportion() {
      return 1 - this.time / this.totalTime;
    },
    get date() {
      return epochToStr(propToEpoch(this.proportion));
    },
  });
  const timeStore = Alpine.store('time');
  Alpine.store('timerInput', defaultTime);

  const timer = new Timer({
    tick: 0.01,
    ontick: (ms) => {
      timeStore.time = ms / 1000;
    },
    onend: () => {
      timeStore.time = 0;
    },
  });
  timer.start(defaultTime).pause();

  window.setTimer = () => {
    const amount = Alpine.store('timerInput');
    if (!amount) return;
    timer.stop();
    timer.start(amount).pause();
    timeStore.time = amount;
    timeStore.totalTime = amount;
  };
  window.pauseTimer = () => {
    if (timer.getStatus() === 'stopped') return;
    timer.getStatus() === 'started' ? timer.pause() : timer.start();
  };
});
