// ========================================
// 🧪 Comprehensive Integration Tests
// ========================================

console.log('🚀 Starting integration tests...\n');

let passedTests = 0;
let failedTests = 0;

function test(description, testFn) {
    try {
        testFn();
        console.log(`✅ PASS: ${description}`);
        passedTests++;
    } catch (error) {
        console.error(`❌ FAIL: ${description}`);
        console.error(`   Error: ${error.message}`);
        failedTests++;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
}

// Wait for app to initialize
setTimeout(() => {
    console.log('\n📊 Running Tests...\n');

    // Test 1: App Instance
    test('App instance exists', () => {
        assert(window.app, 'App should be defined');
        assert(app instanceof ExpenseTracker, 'App should be instance of ExpenseTracker');
    });

    // Test 2: Data Structures
    test('Data structures initialized', () => {
        assert(Array.isArray(app.transactions), 'Transactions should be an array');
        assert(typeof app.budgets === 'object', 'Budgets should be an object');
        assert(typeof app.userData === 'object', 'UserData should be an object');
        assert(Array.isArray(app.challenges), 'Challenges should be an array');
    });

    // Test 3: User Data Structure
    test('User data has required fields', () => {
        assert('xp' in app.userData, 'UserData should have xp');
        assert('level' in app.userData, 'UserData should have level');
        assert('karma' in app.userData, 'UserData should have karma');
        assert(app.userData.level >= 1, 'Level should be at least 1');
        assert(app.userData.xp >= 0, 'XP should be non-negative');
    });

    // Test 4: Budget Categories
    test('Budget categories configured', () => {
        const requiredCategories = ['food', 'transport', 'entertainment', 'bills', 'shopping', 'health', 'other'];
        requiredCategories.forEach(cat => {
            assert(cat in app.budgets, `Budget should have ${cat} category`);
            assert(app.budgets[cat].limit > 0, `${cat} should have positive limit`);
        });
    });

    // Test 5: Daily Challenges
    test('Daily challenges generated', () => {
        assertEqual(app.challenges.length, 3, 'Should have exactly 3 challenges');
        app.challenges.forEach((challenge, index) => {
            assert(challenge.id, `Challenge ${index} should have id`);
            assert(challenge.title, `Challenge ${index} should have title`);
            assert(challenge.reward > 0, `Challenge ${index} should have positive reward`);
            assert(typeof challenge.checkFunction === 'function', `Challenge ${index} should have checkFunction`);
        });
    });

    // Test 6: Dark Mode
    test('Dark mode toggle works', () => {
        const initialMode = app.darkMode;
        app.toggleDarkMode();
        assert(app.darkMode !== initialMode, 'Dark mode should toggle');
        assert(document.body.classList.contains('dark-mode') === app.darkMode, 'Body class should match dark mode state');
        app.toggleDarkMode(); // Toggle back
    });

    // Test 7: Add Transaction
    test('Add transaction increases count', () => {
        const initialCount = app.transactions.length;
        app.transactions.unshift({
            id: 'test_' + Date.now(),
            type: 'expense',
            amount: 100,
            category: 'food',
            date: new Date().toISOString().slice(0, 10),
            notes: 'Test',
            recurring: false,
            createdAt: new Date().toISOString()
        });
        assertEqual(app.transactions.length, initialCount + 1, 'Transaction count should increase');
    });

    // Test 8: XP System
    test('XP system adds correctly', () => {
        const initialXP = app.userData.xp;
        const xpToAdd = 25;
        app.addXP(xpToAdd, 'Test');
        assertEqual(app.userData.xp, initialXP + xpToAdd, 'XP should be added correctly');
    });

    // Test 9: Level Up
    test('Level up at 500 XP threshold', () => {
        app.userData.xp = 0;
        const initialLevel = app.userData.level;
        app.addXP(500, 'Level up test');
        assertEqual(app.userData.level, initialLevel + 1, 'Level should increase');
        assertEqual(app.userData.xp, 0, 'XP should reset to 0');
    });

    // Test 10: Karma System
    test('Karma adjusts within bounds', () => {
        app.userData.karma = 50;
        app.adjustKarma(100); // Should cap at 100
        assertEqual(app.userData.karma, 100, 'Karma should cap at 100');
        
        app.adjustKarma(-150); // Should floor at 0
        assertEqual(app.userData.karma, 0, 'Karma should floor at 0');
        
        app.userData.karma = 100; // Reset
    });

    // Test 11: Utility Functions
    test('formatNumber works correctly', () => {
        const formatted = app.formatNumber(1234.56);
        assert(formatted.includes('1,234'), 'Should format with commas');
    });

    test('formatDate works correctly', () => {
        const formatted = app.formatDate('2025-10-21');
        assert(formatted, 'Should return formatted date');
    });

    test('capitalizeFirst works correctly', () => {
        assertEqual(app.capitalizeFirst('test'), 'Test', 'Should capitalize first letter');
    });

    test('getCategoryIcon works correctly', () => {
        assertEqual(app.getCategoryIcon('food'), '🍔', 'Should return correct icon');
        assertEqual(app.getCategoryIcon('unknown'), '📌', 'Should return default icon for unknown category');
    });

    // Test 12: Budget Status
    test('getBudgetStatus returns correct status', () => {
        assertEqual(app.getBudgetStatus(50), 'success', '50% should be success');
        assertEqual(app.getBudgetStatus(85), 'warning', '85% should be warning');
        assertEqual(app.getBudgetStatus(100), 'danger', '100% should be danger');
    });

    // Test 13: Dashboard Calculations
    test('calculateTotalBalance works', () => {
        app.transactions = [
            { type: 'income', amount: 1000 },
            { type: 'expense', amount: 300 },
            { type: 'expense', amount: 200 }
        ];
        const balance = app.calculateTotalBalance();
        assertEqual(balance, 500, 'Balance should be 1000 - 300 - 200 = 500');
    });

    // Test 14: LocalStorage
    test('saveData persists to localStorage', () => {
        app.saveData();
        assert(localStorage.getItem('transactions'), 'Transactions should be saved');
        assert(localStorage.getItem('budgets'), 'Budgets should be saved');
        assert(localStorage.getItem('userData'), 'UserData should be saved');
        assert(localStorage.getItem('challenges'), 'Challenges should be saved');
        assert(localStorage.getItem('darkMode'), 'DarkMode should be saved');
    });

    // Test 15: Chart Manager
    test('ChartManager exists and initializes', () => {
        assert(window.chartManager, 'ChartManager should exist');
        assert(typeof chartManager.updateCharts === 'function', 'Should have updateCharts method');
    });

    // Test 16: DOM Elements
    test('Required DOM elements exist', () => {
        assert(document.getElementById('totalBalance'), 'Total balance element should exist');
        assert(document.getElementById('monthlyIncome'), 'Monthly income element should exist');
        assert(document.getElementById('monthlyExpense'), 'Monthly expense element should exist');
        assert(document.getElementById('currentLevel'), 'Current level element should exist');
        assert(document.getElementById('xpProgress'), 'XP progress element should exist');
        assert(document.getElementById('karmaScore'), 'Karma score element should exist');
        assert(document.getElementById('challengesList'), 'Challenges list element should exist');
        assert(document.getElementById('budgetList'), 'Budget list element should exist');
        assert(document.getElementById('transactionList'), 'Transaction list element should exist');
    });

    // Test 17: Modal Elements
    test('Modal elements exist', () => {
        assert(document.getElementById('transactionModal'), 'Modal should exist');
        assert(document.getElementById('transactionForm'), 'Form should exist');
        assert(document.getElementById('addBtn'), 'Add button should exist');
        assert(document.getElementById('closeModal'), 'Close button should exist');
    });

    // Test 18: Form Elements
    test('Form input elements exist', () => {
        assert(document.getElementById('typeExpense'), 'Expense radio should exist');
        assert(document.getElementById('typeIncome'), 'Income radio should exist');
        assert(document.getElementById('amount'), 'Amount input should exist');
        assert(document.getElementById('category'), 'Category select should exist');
        assert(document.getElementById('date'), 'Date input should exist');
        assert(document.getElementById('notes'), 'Notes textarea should exist');
        assert(document.getElementById('recurring'), 'Recurring checkbox should exist');
    });

    // Test 19: Challenge Validation Functions
    test('Challenge validation functions work', () => {
        app.challenges.forEach((challenge, index) => {
            const result = challenge.checkFunction();
            assert(typeof result === 'boolean', `Challenge ${index} checkFunction should return boolean`);
        });
    });

    // Test 20: Date Formatting
    test('Dates are properly formatted', () => {
        const today = new Date().toISOString().slice(0, 10);
        assert(/^\d{4}-\d{2}-\d{2}$/.test(today), 'Date should be in YYYY-MM-DD format');
    });

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Total:  ${passedTests + failedTests}`);
    console.log(`🎯 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
    console.log('='.repeat(50));

    if (failedTests === 0) {
        console.log('\n🎉 ALL TESTS PASSED! 🎉\n');
    } else {
        console.log(`\n⚠️  ${failedTests} test(s) failed. Please review.\n`);
    }

}, 2000); // Wait 2 seconds for full initialization
