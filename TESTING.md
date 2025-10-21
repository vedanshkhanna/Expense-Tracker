# 🧪 Manual Testing Checklist

## Test Environment
- **Browser**: Chrome/Firefox/Edge (latest)
- **URL**: http://localhost:8000
- **Date**: October 21, 2025

---

## ✅ Pre-Test Setup

1. Open browser DevTools (F12)
2. Go to Application > Local Storage
3. Clear all data for localhost:8000
4. Refresh the page
5. Verify no console errors

---

## 🧪 Test Cases

### Test 1: Initial Page Load
**Expected:**
- [ ] Page loads without errors
- [ ] Header displays with "Expense Tracker" title
- [ ] Summary cards show ₹0 for all values
- [ ] XP bar shows Level 1, 0/500 XP
- [ ] Budget Karma shows 100
- [ ] Daily Challenges section displays 3 challenges
- [ ] No transactions in the list
- [ ] Charts display (empty or placeholder)
- [ ] FAB button (+) is visible

**How to test:**
1. Open http://localhost:8000
2. Visual inspection of all sections
3. Check console for errors (should be none)

---

### Test 2: Dark Mode Toggle
**Expected:**
- [ ] Moon icon (🌙) visible in header
- [ ] Click toggles to sun icon (☀️)
- [ ] Background turns dark
- [ ] All cards turn dark grey
- [ ] Text remains readable
- [ ] Click again returns to light mode
- [ ] Preference saved (persists on refresh)

**How to test:**
1. Click the 🌙 button in top-right
2. Verify dark theme applies
3. Click ☀️ to toggle back
4. Refresh page - should stay in chosen mode

---

### Test 3: Add Expense Transaction
**Expected:**
- [ ] Modal opens when clicking FAB (+)
- [ ] Form has all fields: type, amount, category, date, notes, recurring
- [ ] "Expense" is selected by default
- [ ] Today's date is pre-filled
- [ ] Save button works
- [ ] Transaction appears in list
- [ ] Dashboard updates (expenses increase)
- [ ] XP increases by +10
- [ ] Toast notification shows success
- [ ] Modal closes

**How to test:**
1. Click + button
2. Select "Expense"
3. Enter amount: 500
4. Select category: Food
5. Keep today's date
6. Add note: "Test lunch"
7. Click "Save Transaction"
8. Verify all expected behaviors

---

### Test 4: Add Income Transaction
**Expected:**
- [ ] Modal opens
- [ ] Select "Income" radio button
- [ ] Amount field accepts input
- [ ] Transaction saves successfully
- [ ] Income card updates
- [ ] Balance increases
- [ ] Transaction list shows green color for income
- [ ] +10 XP earned

**How to test:**
1. Click + button
2. Select "Income"
3. Enter amount: 5000
4. Select category
5. Save
6. Verify income appears with green indicator

---

### Test 5: Budget System
**Expected:**
- [ ] Budget bars show for all categories
- [ ] Percentage updates when expense added
- [ ] Color changes: Green → Yellow → Red
- [ ] Alert at 80% threshold
- [ ] Alert at 100% threshold
- [ ] Karma decreases when budget exceeded

**How to test:**
1. Add expenses to one category (e.g., Food)
2. Add ₹4,000 (should be yellow - 80%)
3. Add ₹1,000 more (should be red - 100%)
4. Verify alert notifications
5. Check karma score decreased

---

### Test 6: XP and Leveling System
**Expected:**
- [ ] XP bar fills progressively
- [ ] Level up occurs at 500 XP
- [ ] Level up notification displays
- [ ] XP resets to 0 after level up
- [ ] Level number increments
- [ ] Animation plays on level up

**How to test:**
1. Add 50 transactions (50 × 10 = 500 XP)
   - OR use test.html "Add Test Data" button
2. Verify level up happens
3. Check notification appears
4. Verify XP bar resets

---

### Test 7: Daily Challenges
**Expected:**
- [ ] 3 challenges displayed
- [ ] Each has icon, title, description, reward
- [ ] Challenges auto-complete when conditions met
- [ ] Checkmark (✅) appears when completed
- [ ] Background turns green when completed
- [ ] XP reward granted
- [ ] Completion toast notification

**How to test:**
1. View initial challenges
2. Complete "Transaction Logger" by adding 3 transactions
3. Verify auto-completion
4. Check XP increased by challenge reward
5. Verify visual changes (green background, checkmark)

**Challenge Types to Test:**
- **Transaction Logger**: Add 3+ transactions
- **Income Tracker**: Add 1 income entry
- **Budget Keeper**: Keep all budgets under 90%
- **Perfect Categorization**: Add transactions with non-"other" categories

---

### Test 8: Charts
**Expected:**
- [ ] Pie chart shows category breakdown
- [ ] Bar chart shows weekly spending
- [ ] Charts update when transactions added
- [ ] Charts responsive to window resize
- [ ] Legend displays correctly
- [ ] Tooltips show on hover

**How to test:**
1. Add expenses in different categories
2. Verify pie chart updates
3. Check weekly bar chart
4. Hover over chart segments
5. Resize browser window

---

### Test 9: Transaction List
**Expected:**
- [ ] Transactions display with icon
- [ ] Amount shows with +/- prefix
- [ ] Date formatted correctly
- [ ] Edit button (✏️) opens modal with data
- [ ] Delete button (🗑️) removes transaction
- [ ] List updates in real-time
- [ ] Most recent transactions appear first

**How to test:**
1. Add multiple transactions
2. Click edit button on one
3. Modify and save
4. Click delete on another
5. Confirm deletion
6. Verify list updates

---

### Test 10: Recurring Transactions
**Expected:**
- [ ] Checkbox available in form
- [ ] Recurring flag saved with transaction
- [ ] Monthly recurrence logic works
- [ ] Notification when recurring transaction added

**How to test:**
1. Add transaction with "Recurring" checked
2. Save and verify flag is set
3. (Future: test monthly recurrence by changing system date)

---

### Test 11: LocalStorage Persistence
**Expected:**
- [ ] Transactions persist after refresh
- [ ] Budgets persist
- [ ] User data (XP, level, karma) persists
- [ ] Challenges persist
- [ ] Dark mode preference persists

**How to test:**
1. Add several transactions
2. Complete a challenge
3. Toggle dark mode
4. Refresh page
5. Verify all data remains

---

### Test 12: Responsive Design
**Expected:**
- [ ] Mobile view (< 768px): Single column layout
- [ ] Tablet view (768-1024px): Adaptive grid
- [ ] Desktop view (> 1024px): Multi-column layout
- [ ] FAB button repositions on mobile
- [ ] Modal adapts to screen size
- [ ] Charts scale appropriately

**How to test:**
1. Open DevTools
2. Toggle device toolbar
3. Test various screen sizes
4. Verify layout adapts correctly

---

### Test 13: Error Handling
**Expected:**
- [ ] Empty amount field shows validation error
- [ ] No category selected shows error
- [ ] Invalid date handled gracefully
- [ ] Negative amounts prevented (min="0")

**How to test:**
1. Try to save transaction without amount
2. Try without category
3. Try with invalid inputs
4. Verify appropriate error handling

---

### Test 14: Edge Cases
**Expected:**
- [ ] Large amounts (999,999) display correctly
- [ ] Long notes text doesn't break layout
- [ ] Many transactions (100+) perform well
- [ ] Empty state displays when no data
- [ ] Special characters in notes handled

**How to test:**
1. Add transaction with amount ₹999,999
2. Add very long note
3. Use test.html to add 100+ transactions
4. Clear data and verify empty states

---

## 🎯 Acceptance Criteria

**All tests must pass:**
- ✅ No console errors
- ✅ All features functional
- ✅ Data persists correctly
- ✅ UI responsive on all devices
- ✅ Dark mode works perfectly
- ✅ Daily challenges auto-complete
- ✅ XP and leveling system accurate
- ✅ Charts display correctly

---

## 🐛 Known Issues

(Document any issues found during testing here)

1. _Issue: [Description]_
   - **Severity**: High/Medium/Low
   - **Steps to reproduce**:
   - **Expected**:
   - **Actual**:
   - **Status**: Open/Fixed

---

## ✅ Test Sign-Off

- **Tester**: ________________
- **Date**: ________________
- **Build**: v1.0.0
- **Status**: ⬜ PASS / ⬜ FAIL
- **Notes**: ________________

---

## 🚀 Quick Test with test.html

1. Navigate to http://localhost:8000/test.html
2. Click "Run All Tests"
3. Review automated test results
4. Click "Add Test Data" for sample transactions
5. Click "Go to App" to verify visually

**Automated tests should show:**
- ✅ All 12 tests passing
- ✅ No errors in console log
- ✅ Green success indicators

---

**Happy Testing! 🧪**
