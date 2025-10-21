# 💰 Expense Tracker - Gamified Finance Manager

A modern, responsive expense tracking application with gamification features. Track your expenses and income across mobile and desktop devices with XP system, budget tracking, and visual analytics.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 🌟 Features

### Core Functionality
- ✅ **Add/Edit/Delete Transactions** - Track expenses and income with detailed categorization
- 📊 **Dashboard Analytics** - Real-time balance, monthly income, and expense summaries
- 💰 **Budget Management** - Set category-wise budgets with visual progress bars
- 📈 **Visual Charts** - Pie chart for category breakdown and bar chart for weekly trends
- 🔁 **Recurring Transactions** - Automatically add monthly recurring expenses/income
- 💾 **Local Storage** - All data saved locally in your browser

### Gamification
- 🎮 **XP System** - Earn experience points for logging transactions
- 📊 **Level Progression** - Level up every 500 XP
- 🏆 **Budget Karma** - Score based on budget adherence
- 🎯 **Achievement System** - Unlock badges and rewards
- ⚡ **Real-time Feedback** - Toast notifications for all actions

### Cross-Platform
- 📱 **Mobile Responsive** - Optimized for smartphones and tablets
- 💻 **Desktop Optimized** - Enhanced layout for larger screens
- 🚀 **PWA Ready** - Install as a standalone app
- 🌐 **Offline Support** - Works without internet connection

---

## 🚀 Quick Start

### Option 1: Direct Browser (Simplest)
1. Clone or download this repository
2. Open `index.html` in your browser
3. Start tracking expenses!

### Option 2: Local Server (Recommended)
```powershell
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

---

## 📁 Project Structure

```
Expense Tracker/
│
├── index.html              # Main HTML file
├── manifest.json           # PWA manifest
│
├── styles/
│   └── main.css           # Complete styling
│
├── scripts/
│   ├── app.js             # Main application logic
│   └── charts.js          # Chart.js visualization
│
├── docs/                  # Documentation
│   ├── dashboard-design.md
│   ├── Feature-Logic-Blueprints.md
│   ├── roadmap.md
│   └── security-and-sync.md
│
└── assets/                # Images and icons (to be added)
    ├── icon-192.png
    └── icon-512.png
```

---

## 💡 How to Use

### Adding a Transaction
1. Click the **+** floating button (bottom-right)
2. Choose **Expense** or **Income**
3. Enter amount, select category, and date
4. Add optional notes
5. Enable recurring if it's a monthly transaction
6. Click **Save Transaction**

### Managing Budgets
- Default budgets are set for each category
- View progress in the **Category Budgets** section
- Get alerts when you reach 80% or exceed 100%
- Earn **+50 XP** when all budgets are under control

### Earning XP
- **+10 XP** - Log a transaction
- **+50 XP** - Keep all budgets under limit
- **+100 XP** - Complete daily challenges (future)
- **Level up** every 500 XP

### Budget Karma
- Starts at **100 points**
- **-10 karma** when you exceed a budget
- Visual indicators: Green (80+), Yellow (50-79), Red (<50)

---

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `styles/main.css`:

```css
:root {
    --primary: #6C63FF;        /* Main brand color */
    --success: #4CAF50;        /* Income/success */
    --warning: #FFC107;        /* Budget warning */
    --danger: #F44336;         /* Expense/danger */
}
```

### Adding Categories
Edit `index.html` in the category select dropdown:

```html
<option value="newCategory">🎯 New Category</option>
```

Also add to `scripts/app.js` in the budgets object:

```javascript
this.budgets = {
    newCategory: { limit: 3000, spent: 0 }
};
```

### Modifying XP Rates
Edit `scripts/app.js`:

```javascript
this.addXP(10, 'Logged a transaction');  // Change 10 to desired amount
```

---

## 📊 Data Structure

### Transaction Object
```javascript
{
    id: "1729512000000",
    type: "expense",          // or "income"
    amount: 500,
    category: "food",
    date: "2025-10-21",
    notes: "Lunch with friends",
    recurring: false,
    createdAt: "2025-10-21T10:30:00.000Z"
}
```

### Budget Object
```javascript
{
    food: { limit: 5000, spent: 2500 },
    transport: { limit: 3000, spent: 1200 }
}
```

### User Data Object
```javascript
{
    xp: 150,
    level: 2,
    karma: 85,
    badges: ["first_transaction", "budget_master"]
}
```

---

## 🔒 Privacy & Security

- ✅ **All data stored locally** in browser's localStorage
- ✅ **No server communication** - completely offline
- ✅ **No tracking or analytics**
- ✅ **No account required**
- ⚠️ **Note**: Clearing browser data will delete all transactions

### Data Backup
To backup your data:
1. Open browser DevTools (F12)
2. Go to **Application** > **Local Storage**
3. Copy the values for `transactions`, `budgets`, and `userData`
4. Save to a text file

---

## 🛣️ Roadmap

### Phase 1: Core Features ✅
- [x] Basic transaction management
- [x] Dashboard calculations
- [x] Budget tracking
- [x] XP and Karma system

### Phase 2: Advanced Features 🚧
- [ ] Calendar view
- [ ] Export to CSV/PDF
- [ ] Daily challenges
- [ ] Badge system

### Phase 3: Cloud Sync 📋
- [ ] Firebase integration
- [ ] PIN authentication
- [ ] Multi-device sync
- [ ] Data encryption

### Phase 4: Premium Features 📋
- [ ] Receipt scanner
- [ ] Voice commands
- [ ] AI-powered insights
- [ ] Custom categories

---

## 🐛 Troubleshooting

### Transactions not saving
- Check if browser allows localStorage
- Try a different browser
- Clear cache and reload

### Charts not displaying
- Ensure internet connection (Chart.js CDN)
- Check browser console for errors
- Update to latest browser version

### Modal not opening
- Disable browser extensions
- Check JavaScript console
- Verify all files are loaded

---

## 📱 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Full Support |
| Firefox | 88+     | ✅ Full Support |
| Safari  | 14+     | ✅ Full Support |
| Edge    | 90+     | ✅ Full Support |
| Opera   | 76+     | ✅ Full Support |

---

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## 🙏 Acknowledgments

- **Chart.js** - Beautiful charts
- **VS Code** - Development environment
- **GitHub Copilot** - Development assistance

---

## 📞 Support

Found a bug or have a suggestion?
- Open an issue on GitHub
- Check the `docs/` folder for detailed documentation

---

## 🎯 Quick Reference

### Keyboard Shortcuts (Future)
- `Ctrl + N` - New transaction
- `Ctrl + S` - Save
- `Esc` - Close modal

### Default Budgets
- Food: ₹5,000
- Transport: ₹3,000
- Entertainment: ₹2,000
- Bills: ₹8,000
- Shopping: ₹4,000
- Health: ₹3,000
- Other: ₹2,000

---

**Made with ❤️ for better financial tracking**
