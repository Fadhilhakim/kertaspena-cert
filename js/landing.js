(function () {
  const form = document.getElementById('event-form');
  const select = document.getElementById('event-select');
  const button = document.getElementById('continue-btn');
  const error = document.getElementById('event-error');

  Object.entries(window.EVENTS).forEach(([slug, event]) => {
    const option = document.createElement('option');
    option.value = slug;
    option.textContent = `${event.label} — ${event.date}`;
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    const valid = Boolean(select.value);
    button.disabled = !valid;
    error.hidden = valid;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!select.value || !getEventBySlug(select.value)) {
      button.disabled = true;
      error.hidden = false;
      return;
    }
    window.location.href = `search/search.html?event=${encodeURIComponent(select.value)}`;
  });
})();
