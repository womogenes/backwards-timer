const main = () => {
  console.log('Hello');
};

// Record when the page was opened.
window.pageOpened = new Date();

// Global stores!
document.addEventListener('alpine:init', () => {
  console.log('Alpine initialized.');

  eventsInit();

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
    if (e.key === '.') {
      factor = 0.001;
    } else if (e.key === ',') {
      factor = -0.001;
    } else if (e.key === 'ArrowRight') {
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

    let newTime = Math.min(
      timeStore.time - timeStore.totalTime * factor,
      timeStore.totalTime,
    );
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
    tick: 1 / 60,
    onstart: function () {
      if (this.getDuration() / 1000 === timeStore.totalTime) {
        console.log('timer started');
      }
    },
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
