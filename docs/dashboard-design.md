# 📊 Dashboard Design Document

This document defines the layout, components, and gamified elements of the solo expense tracker dashboard.

---

## 🧱 Layout Structure

### 🏠 Home / Dashboard Screen

- **Top Bar**
  - App name
  - Profile icon or mascot
  - Settings icon

- **Summary Cards**
  - 💰 Total Balance
  - 📈 Monthly Income
  - 📉 Monthly Expenses

- **Progress Section**
  - Category-wise budget progress bars
  - XP meter and current level
  - Budget Karma score

- **Charts Section**
  - Pie chart: Category breakdown
  - Bar chart: Weekly or daily spend

- **Quick Add Button**
  - Floating “+” button to add expense/income

---

## 🧩 Component Breakdown

### 🔹 Expense/Income Entry Form

- Fields:
  - Amount
  - Type toggle: Expense / Income
  - Category dropdown
  - Date picker
  - Notes (optional)
  - Recurring toggle (optional)

### 🔹 History View

- List of entries with:
  - Icon, category, amount, date
  - Swipe gestures (if enabled)
  - Edit/Delete options

### 🔹 Calendar View

- Monthly calendar with:
  - Daily spend bubbles or heatmap
  - Tap to view day’s entries

### 🔹 Budget Manager

- Set monthly limits per category
- View progress bars
- Alerts when nearing/exceeding limits

---

## 🕹️ Gamified Elements

### 🎮 XP System

- Earn XP for:
  - Logging entries
  - Staying under budget
  - Completing challenges

- XP bar with level indicator
- Level-up animation and sound

### 🏆 Badges

- Examples:
  - “Budget Boss” – All categories under budget
  - “Streak Master” – Logged daily for 7 days
  - “Smart Saver” – Reduced spending in 3 categories

### 📅 Daily Challenges

- Examples:
  - “Spend less than ₹200 today”
  - “Log 3 expenses before 8 PM”

- Completion triggers animation and XP

---

## 🎨 Vibe Coding Enhancements

- Animated mascot reactions (e.g., owl cheers)
- Sound effects for actions (ding, swoosh)
- Currency switcher with morph animation
- Dark/light mode toggle
- Easter egg commands (e.g., “abracadabra” resets with flair)

---

## 📱 Responsive Design Notes

- Mobile:
  - Swipe gestures
  - Floating buttons
  - Compact layout

- Desktop:
  - Keyboard shortcuts
  - Expanded charts and filters

---