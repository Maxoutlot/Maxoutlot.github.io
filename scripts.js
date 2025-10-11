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

// Calendar widget functionality
(function() {
  const monthYear = document.getElementById('month-year');
  const calendarFooter = document.getElementById('calendar-footer');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const calendarDays = document.querySelectorAll('.calendar-day');

  // Modal elements
  const dailyPostsModal = document.getElementById('daily-posts-modal');
  const modalDate = document.getElementById('modal-date');
  const dailyPostsList = document.getElementById('daily-posts-list');

  let currentDate = new Date();
  let selectedDate = null;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // All posts data with parsed dates for filtering
  const allPosts = [
    {
      city: 'Xian',
      date: '5 - October - 2025',
      title: 'A day before the departure',
      content: "Tomorrow I'll fly to Xi'an. That's a new city and a new chapter in my life. I'll be blogging here about my expirience.",
      parsedDate: new Date(2025, 9, 5) // Month is 0-indexed
    },
    {
      city: 'Lanzhou',
      date: '4 - October - 2025',
      title: 'Exploring Lanzhou',
      content: 'Just arrived in Lanzhou! The Yellow River is stunning and the famous beef noodles are incredible. This city has such a different vibe from Xi\'an.',
      parsedDate: new Date(2025, 9, 4)
    },
    {
      city: 'Chengdu',
      date: '3 - October - 2025',
      title: 'Chengdu Adventures',
      content: 'Chengdu is amazing! Visited the Giant Panda Research Base today and saw the most adorable pandas. The spicy hotpot here is on another level. Can\'t wait to explore more of this vibrant city.',
      parsedDate: new Date(2025, 9, 3)
    },
    {
      city: 'Hangzhou',
      date: '1 - October - 2025',
      title: 'Hangzhou Discovery',
      content: 'Hangzhou is breathtaking! The West Lake is absolutely stunning and the tea culture here is fascinating. The silk markets are incredible and the local cuisine is delicious.',
      parsedDate: new Date(2025, 9, 1)
    },
    {
      city: 'Hangzhou',
      date: '28 - September - 2025',
      title: 'Early Hangzhou Impressions',
      content: 'Just arrived in Hangzhou a week ago and I\'m already in love! The ancient temples and gardens are incredible. The local people are so welcoming and the street food scene is amazing.',
      parsedDate: new Date(2025, 8, 28) // September is 8 (0-indexed)
    }
  ];

  function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update month/year header
    monthYear.textContent = `${monthNames[month]} ${year}`;

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Update footer with current date
    const today = new Date();
    calendarFooter.textContent = `Today is ${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

    // Clear all calendar days first
    calendarDays.forEach(day => {
      day.classList.remove('today', 'selected', 'other-month');
      day.textContent = '';
    });

    // Add days from previous month (if needed)
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();

    for (let i = 0; i < startingDayOfWeek; i++) {
      const dayIndex = i;
      if (calendarDays[dayIndex]) {
        const prevMonthDay = prevMonthDays - startingDayOfWeek + i + 1;
        calendarDays[dayIndex].textContent = prevMonthDay;
        calendarDays[dayIndex].classList.add('other-month');
        calendarDays[dayIndex].dataset.date = `${year}-${String(month).padStart(2, '0')}-${String(prevMonthDay).padStart(2, '0')}`;
      }
    }

    // Add current month days
    let dayIndex = startingDayOfWeek;
    for (let day = 1; day <= daysInMonth; day++) {
      if (calendarDays[dayIndex]) {
        calendarDays[dayIndex].textContent = day;
        calendarDays[dayIndex].dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // Mark today
        const today = new Date();
        if (day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()) {
          calendarDays[dayIndex].classList.add('today');
        }

        dayIndex++;
      }
    }

    // Add days from next month (if needed)
    let nextMonthDay = 1;
    while (dayIndex < 42) { // 6 weeks * 7 days
      if (calendarDays[dayIndex]) {
        calendarDays[dayIndex].textContent = nextMonthDay;
        calendarDays[dayIndex].classList.add('other-month');
        calendarDays[dayIndex].dataset.date = `${year}-${String(month + 2).padStart(2, '0')}-${String(nextMonthDay).padStart(2, '0')}`;
        nextMonthDay++;
      }
      dayIndex++;
    }
  }

  // Initialize calendar
  updateCalendar();

  // Navigation buttons
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', function() {
      currentDate.setMonth(currentDate.getMonth() - 1);
      updateCalendar();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', function() {
      currentDate.setMonth(currentDate.getMonth() + 1);
      updateCalendar();
    });
  }

  // Day selection - filter and show posts for that day
  calendarDays.forEach(day => {
    day.addEventListener('click', function() {
      if (this.classList.contains('other-month')) return; // Don't allow selection of other month days

      // Remove previous selection
      calendarDays.forEach(d => d.classList.remove('selected'));

      // Add selection to clicked day
      this.classList.add('selected');

      // Get the selected date
      const dateStr = this.dataset.date;
      if (dateStr) {
        selectedDate = new Date(dateStr);

        // Filter posts for this date
        const dayPosts = allPosts.filter(post => {
          return post.parsedDate.toDateString() === selectedDate.toDateString();
        });

        // Show posts for this day
        showDailyPosts(dayPosts, selectedDate);
      }
    });
  });

  function showDailyPosts(posts, date) {
    if (!dailyPostsModal || !modalDate || !dailyPostsList) return;

    // Update modal title with selected date
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    modalDate.textContent = date.toLocaleDateString('en-US', dateOptions);

    // Clear previous posts
    dailyPostsList.innerHTML = '';

    if (posts.length === 0) {
      dailyPostsList.innerHTML = '<div class="no-posts-message">No posts found for this date.</div>';
    } else {
      // Add each post to the modal
      posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'daily-post-item';
        postElement.innerHTML = `
          <div class="daily-post-date">${post.date}</div>
          <div class="daily-post-title">${post.title}</div>
          <div class="daily-post-content">${post.content}</div>
          ${post.city === 'Xian' ? `
            <div class="post-image-carousel">
              <div class="carousel-container">
                <img src="duck.png" alt="A duck in Xi'an" class="carousel-image active" data-index="0" />
                <img src="Xian.jpg" alt="Xi'an cityscape" class="carousel-image" data-index="1" />
                <button class="carousel-nav prev-btn" onclick="prevImage(this)">‹</button>
                <button class="carousel-nav next-btn" onclick="nextImage(this)">›</button>
                <div class="carousel-indicators">
                  <span class="indicator active" data-index="0"></span>
                  <span class="indicator" data-index="1"></span>
                </div>
              </div>
            </div>
          ` : ''}
          <a class="daily-post-city-tag" href="city.html?city=${post.city}" aria-label="See all posts from ${post.city}">#${post.city}</a>
        `;
        dailyPostsList.appendChild(postElement);
      });
    }

    // Show modal
    dailyPostsModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }

  // Close the modal
  window.closeDailyPostsModal = function() {
    if (dailyPostsModal) {
      dailyPostsModal.classList.remove('show');
      document.body.style.overflow = ''; // Restore scrolling

      // Clear selection
      calendarDays.forEach(d => d.classList.remove('selected'));
      selectedDate = null;
    }
  };

  // Close modal when clicking outside
  if (dailyPostsModal) {
    dailyPostsModal.addEventListener('click', function(e) {
      if (e.target === dailyPostsModal) {
        closeDailyPostsModal();
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && dailyPostsModal.classList.contains('show')) {
      closeDailyPostsModal();
    }
  });

  // Keyboard navigation for accessibility
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft' && prevMonthBtn) {
      prevMonthBtn.click();
    } else if (e.key === 'ArrowRight' && nextMonthBtn) {
      nextMonthBtn.click();
    }
  });

})();

// Carousel functionality
function nextImage(button) {
  const container = button.closest('.carousel-container');
  if (!container) return;

  const images = container.querySelectorAll('.carousel-image');
  const indicators = container.querySelectorAll('.indicator');
  const currentActive = container.querySelector('.carousel-image.active');

  if (!currentActive || images.length < 2) return;

  const currentIndex = parseInt(currentActive.dataset.index);
  const nextIndex = (currentIndex + 1) % images.length;

  // Switch images
  images[currentIndex].classList.remove('active');
  images[nextIndex].classList.add('active');

  // Update indicators
  indicators[currentIndex].classList.remove('active');
  indicators[nextIndex].classList.add('active');
}

function prevImage(button) {
  const container = button.closest('.carousel-container');
  if (!container) return;

  const images = container.querySelectorAll('.carousel-image');
  const indicators = container.querySelectorAll('.indicator');
  const currentActive = container.querySelector('.carousel-image.active');

  if (!currentActive || images.length < 2) return;

  const currentIndex = parseInt(currentActive.dataset.index);
  const prevIndex = (currentIndex - 1 + images.length) % images.length;

  // Switch images
  images[currentIndex].classList.remove('active');
  images[prevIndex].classList.add('active');

  // Update indicators
  indicators[currentIndex].classList.remove('active');
  indicators[prevIndex].classList.add('active');
}

// Happiness Calendar functionality
(function() {
  const happinessMonthYear = document.getElementById('happiness-month-year');
  const happinessFooter = document.getElementById('happiness-footer');
  const happinessPrevBtn = document.getElementById('happiness-prev-month');
  const happinessNextBtn = document.getElementById('happiness-next-month');
  const happinessDays = document.querySelectorAll('#happiness-calendar-widget .calendar-day');

  // Statistics elements
  const happyCount = document.getElementById('happy-count');
  const neutralCount = document.getElementById('neutral-count');
  const unhappyCount = document.getElementById('unhappy-count');
  const totalCount = document.getElementById('total-count');
  const averageScore = document.getElementById('average-score');

  console.log('Happiness calendar initialized with', happinessDays.length, 'days');

  let currentHappinessDate = new Date();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Happiness data storage (in a real app, this would be in a database)
  let happinessData = {};

  function updateHappinessCalendar() {
    console.log('Updating happiness calendar...');
    const year = currentHappinessDate.getFullYear();
    const month = currentHappinessDate.getMonth();

    // Update month/year header
    if (happinessMonthYear) {
      happinessMonthYear.textContent = `${monthNames[month]} ${year}`;
      console.log('Updated month/year to:', `${monthNames[month]} ${year}`);
    }

    // Update footer with current date
    const today = new Date();
    if (happinessFooter) {
      happinessFooter.textContent = `Tracking happiness for ${monthNames[today.getMonth()]} ${today.getFullYear()}`;
    }

    // Clear all calendar days first
    console.log('Clearing', happinessDays.length, 'calendar days');
    happinessDays.forEach(day => {
      day.classList.remove('today', 'happiness-rated', 'happiness-1-3', 'happiness-4-6', 'happiness-7-10');
      day.textContent = '';
      day.title = '';
    });

    // Add current month days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    console.log(`Month: ${monthNames[month]}, Year: ${year}, Days in month: ${daysInMonth}, Starting day of week: ${startingDayOfWeek}`);

    // Add current month days
    let dayIndex = startingDayOfWeek;
    for (let day = 1; day <= daysInMonth; day++) {
      if (happinessDays[dayIndex]) {
        happinessDays[dayIndex].textContent = day;
        console.log(`Set day ${day} at index ${dayIndex}`);

        // Check if this day has happiness data
        const dayDate = new Date(year, month, day);
        const dateKey = dayDate.toISOString().split('T')[0];

        if (happinessData[dateKey]) {
          const rating = happinessData[dateKey].rating;
          happinessDays[dayIndex].classList.add('happiness-rated');

          // Color code based on rating
          if (rating >= 1 && rating <= 3) {
            happinessDays[dayIndex].classList.add('happiness-1-3');
          } else if (rating >= 4 && rating <= 6) {
            happinessDays[dayIndex].classList.add('happiness-4-6');
          } else if (rating >= 7 && rating <= 10) {
            happinessDays[dayIndex].classList.add('happiness-7-10');
          }

          happinessDays[dayIndex].title = `Happiness: ${rating}/10 - ${happinessData[dateKey].note || 'No note'}`;
        }

        // Mark today
        const today = new Date();
        if (day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()) {
          happinessDays[dayIndex].classList.add('today');
        }

        dayIndex++;
      }
    }

    // Update statistics
    updateStatistics();
  }

  function updateStatistics() {
    let happy = 0, neutral = 0, unhappy = 0, total = 0, sum = 0;

    Object.values(happinessData).forEach(entry => {
      const rating = entry.rating;
      total++;
      sum += rating;

      if (rating >= 1 && rating <= 3) {
        unhappy++;
      } else if (rating >= 4 && rating <= 6) {
        neutral++;
      } else if (rating >= 7 && rating <= 10) {
        happy++;
      }
    });

    if (happyCount) happyCount.textContent = happy;
    if (neutralCount) neutralCount.textContent = neutral;
    if (unhappyCount) unhappyCount.textContent = unhappy;
    if (totalCount) totalCount.textContent = total;
    if (averageScore) averageScore.textContent = total > 0 ? (sum / total).toFixed(1) : '0.0';
  }

  // Initialize happiness calendar
  console.log('Initializing happiness calendar...');
  setTimeout(() => {
    updateHappinessCalendar();
    console.log('Happiness calendar update completed');
  }, 100);

  // Navigation buttons
  if (happinessPrevBtn) {
    happinessPrevBtn.addEventListener('click', function() {
      currentHappinessDate.setMonth(currentHappinessDate.getMonth() - 1);
      updateHappinessCalendar();
    });
  }

  if (happinessNextBtn) {
    happinessNextBtn.addEventListener('click', function() {
      currentHappinessDate.setMonth(currentHappinessDate.getMonth() + 1);
      updateHappinessCalendar();
    });
  }

  // Day selection - rate happiness for that day
  happinessDays.forEach(day => {
    day.addEventListener('click', function() {
      if (this.classList.contains('other-month')) return; // Don't allow selection of other month days

      const dateStr = this.dataset.date;
      if (dateStr) {
        const selectedDate = new Date(dateStr);
        showHappinessRating(selectedDate);
      }
    });
  });

  function showHappinessRating(date) {
    const dateKey = date.toISOString().split('T')[0];
    const existingData = happinessData[dateKey];

    const rating = existingData ? existingData.rating : 5;
    const note = existingData ? existingData.note : '';

    // Create modal for rating input
    const modal = document.createElement('div');
    modal.className = 'daily-posts-modal';
    modal.innerHTML = `
      <button class="daily-posts-close" onclick="this.parentElement.remove()">×</button>
      <div class="daily-posts-header">
        <div class="daily-posts-title">Rate Happiness</div>
        <div class="daily-posts-date">${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      <div class="rating-container" style="padding: 20px;">
        <div class="rating-slider-container">
          <input type="range" id="happiness-input" min="1" max="10" value="${rating}" class="slider" style="width: 100%; margin: 20px 0;">
          <div class="rating-labels" style="display: flex; justify-content: space-between; margin-top: 10px;">
            <span>😢 Very Sad</span>
            <span class="rating-display" id="rating-display">${rating}</span>
            <span>😄 Very Happy</span>
          </div>
        </div>
        <textarea id="happiness-note-input" placeholder="Why did you feel this way? (Optional)" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; resize: vertical; font-family: inherit;" rows="3">${note}</textarea>
        <div class="rating-buttons" style="margin-top: 15px; text-align: center;">
          <button onclick="saveHappinessRating('${dateKey}')" style="background: #4A90E2; color: white; border: none; padding: 10px 20px; border-radius: 4px; margin: 0 5px; cursor: pointer;">Save Rating</button>
          <button onclick="this.closest('.daily-posts-modal').remove()" style="background: #ccc; color: #333; border: none; padding: 10px 20px; border-radius: 4px; margin: 0 5px; cursor: pointer;">Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Add slider functionality
    const slider = modal.querySelector('#happiness-input');
    const display = modal.querySelector('#rating-display');

    slider.addEventListener('input', function() {
      display.textContent = this.value;
    });
  }

  // Make functions global so they can be called from onclick
  window.saveHappinessRating = function(dateKey) {
    const modal = document.querySelector('.daily-posts-modal');
    const rating = modal.querySelector('#happiness-input').value;
    const note = modal.querySelector('#happiness-note-input').value;

    // Store the rating
    happinessData[dateKey] = {
      rating: parseInt(rating),
      note: note,
      date: new Date(dateKey)
    };

    // Remove modal
    modal.remove();
    document.body.style.overflow = '';

    // Update calendar
    updateHappinessCalendar();

    // Show success message in footer
    happinessFooter.textContent = `✅ Saved happiness rating: ${rating}/10 for ${new Date(dateKey).toLocaleDateString()}`;
    setTimeout(() => {
      updateHappinessCalendar();
    }, 2000);
  };

  // Keyboard navigation for accessibility
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft' && happinessPrevBtn) {
      happinessPrevBtn.click();
    } else if (e.key === 'ArrowRight' && happinessNextBtn) {
      happinessNextBtn.click();
    }
  });

})();
