// scripts.js
// Calculates days since a configured start date and writes it to #days-count
(function () {
  // Configure the arrival date (YYYY, M-1, D) — change this to your actual arrival date
  // The user said they'll arrive tomorrow, so set arrival to 2025-10-06 here.
  const arrival = new Date(2025, 9, 6); // 2025-10-06 (month is 0-indexed)

  // Counting mode:
  // We show 0 for any date before arrival. On the arrival day we show 1, then increment by 1 each day.

  function daysSinceInclusive(start, end) {
    const msPerDay = 24 * 60 * 60 * 1000;
    // floor the difference in days
    const diff = Math.floor((end - start) / msPerDay);
    // if end is before start, show 0; otherwise include the start day (arrival day = 1)
    return diff < 0 ? 0 : diff + 1;
  }

  function updateWidget() {
    const el = document.getElementById('days-count');
    if (!el) return;
    const today = new Date();
    const days = daysSinceInclusive(arrival, today);
    el.textContent = days.toString();
  }

  document.addEventListener('DOMContentLoaded', updateWidget);
})();
