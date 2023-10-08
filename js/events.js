// (pre)historical events

window.eventsInit = async () => {
  window.allEvents = await (await fetch('data/all_events.json')).json();
  console.log('Events loaded.');
};
