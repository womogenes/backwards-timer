// (pre)historical events

window.eventsInit = async () => {
  window.allEvents = await (await fetch('data/all_events.json')).json();
  console.log('Events loaded.');

  let index = 0;
  Alpine.store('eventList', [allEvents[0]]);

  console.log('interval set!');
  const handle = window.setInterval(() => {
    index++;
    Alpine.store('eventList', [allEvents[index], ...Alpine.store('eventList')]);
  }, 100);
  console.log(handle);
};
