const main = () => {
  console.log('Hello');
};

// Global stores!
document.addEventListener('alpine:init', () => {
  console.log('Alpine initialized.');

  const defaultTime = 60 * 10;
  Alpine.store('time', {
    time: Alpine.$persist(defaultTime).as('time'),
    totalTime: Alpine.$persist(defaultTime).as('totalTime'),
    get proportion() {
      return 1 - this.time / this.totalTime;
    },
    get date() {
      return epochToStr(propToEpoch(this.proportion));
    },
  });
  const timeStore = Alpine.store('time');
  Alpine.store('timerInput', timeStore.totalTime);

  // Keybinds to change the time
  document.addEventListener('keydown', (e) => {
    if (timeStore.time >= timeStore.totalTime && timeStore.time <= 0) return;

    let factor;
    if (e.key === 'ArrowRight') {
      factor = 0.01;
    } else if (e.key === 'ArrowLeft') {
      factor = -0.01;
    } else if (e.key === 'l') {
      factor = 0.1;
    } else if (e.key === 'j') {
      factor = -0.1;
    } else if (e.key === 'k') {
      timer.getStatus() === 'paused' ? timer.start() : timer.pause();
      return;
    } else {
      return;
    }

    let newTime = timeStore.time - timeStore.totalTime * factor;
    timeStore.time = newTime;
    if (timer.getStatus() === 'paused') {
      timer.stop();
      timer.start(newTime).pause();
    } else {
      timer.stop();
      timer.start(newTime);
    }
  });

  const timer = new Timer({
    tick: 0.01,
    ontick: (ms) => {
      timeStore.time = ms / 1000;
    },
    onend: () => {
      timeStore.time = 0;
    },
  });
  timer.start(timeStore.time).pause();

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
