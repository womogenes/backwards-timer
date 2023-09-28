console.log('Hello!');

// Global stores!
document.addEventListener('alpine:init', () => {
  console.log('Alpine initialized.');
  Alpine.store('date', new Date());

  window.setInterval(() => {
    Alpine.store('date', new Date());
    console.log('Date updated');
  }, 100);
});
