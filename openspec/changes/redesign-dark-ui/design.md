# Design: Dark Mode Dashboard

## Color Palette (Reference)
-   `--bg-main`: `#0e1015`
-   `--bg-card`: `#1e1f2b`
-   `--primary`: `#246bfd`
-   `--text-main`: `#ffffff`
-   `--text-muted`: `#6c6d7a`

## Layout Structure
```html
<div id="app">
  <header class="calendar-header">
    <h2>October 2023</h2>
    <div class="nav-controls"> < > </div>
  </header>
  
  <div class="calendar-grid">
    <!-- Weekday Headers (S M T W T F S) -->
    <!-- Day Cells -->
  </div>

  <div class="section-header">
    <span>NEXT UP</span>
    <a href="#">View All</a>
  </div>

  <div class="event-list">
    <!-- Event Card -->
    <div class="event-card">
      <div class="date-box">
        <span class="month">OCT</span>
        <span class="day">25</span>
      </div>
      <div class="info">
        <div class="title">Project Review</div>
        <div class="time">09:00 AM - 10:30 AM</div>
      </div>
    </div>
  </div>

  <footer class="settings-footer">
    <button>⚙️ Settings</button>
  </footer>
</div>
```
