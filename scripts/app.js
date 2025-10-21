// ========================================
// 💰 Expense Tracker - Main Application Logic
// ========================================

class ExpenseTracker {
    constructor() {
        this.transactions = [];
        this.budgets = {};
        this.userData = {
            xp: 0,
            level: 1,
            karma: 100,
            badges: []
        };
        this.challenges = [];
        this.achievements = [];
        this.unlockedAchievements = [];
        this.darkMode = false;
        
        this.initAchievements();
        this.init();
    }

    // ========================================
    // 🚀 Initialization
    // ========================================
    init() {
        this.loadData();
        this.initEventListeners();
        this.initDarkMode();
        this.updateDashboard();
        this.renderTransactions();
        this.updateBudgets();
        this.updateGamification();
        this.checkRecurringTransactions();
        this.initDailyChallenges();
        this.renderChallenges();
        this.renderAchievements();
    }

    // ========================================
    // 💾 Data Management
    // ========================================
    loadData() {
        const savedTransactions = localStorage.getItem('transactions');
        const savedBudgets = localStorage.getItem('budgets');
        const savedUserData = localStorage.getItem('userData');
        const savedChallenges = localStorage.getItem('challenges');
        const savedAchievements = localStorage.getItem('unlockedAchievements');
        const savedDarkMode = localStorage.getItem('darkMode');

        if (savedTransactions) {
            this.transactions = JSON.parse(savedTransactions);
        }

        if (savedBudgets) {
            this.budgets = JSON.parse(savedBudgets);
        } else {
            // Default budgets
            this.budgets = {
                food: { limit: 5000, spent: 0 },
                transport: { limit: 3000, spent: 0 },
                entertainment: { limit: 2000, spent: 0 },
                bills: { limit: 8000, spent: 0 },
                shopping: { limit: 4000, spent: 0 },
                health: { limit: 3000, spent: 0 },
                other: { limit: 2000, spent: 0 }
            };
        }

        if (savedUserData) {
            this.userData = JSON.parse(savedUserData);
        }

        if (savedChallenges) {
            this.challenges = JSON.parse(savedChallenges);
        }

        if (savedAchievements) {
            this.unlockedAchievements = JSON.parse(savedAchievements);
        }

        if (savedDarkMode) {
            this.darkMode = JSON.parse(savedDarkMode);
        }
    }

    saveData() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
        localStorage.setItem('budgets', JSON.stringify(this.budgets));
        localStorage.setItem('userData', JSON.stringify(this.userData));
        localStorage.setItem('challenges', JSON.stringify(this.challenges));
        localStorage.setItem('unlockedAchievements', JSON.stringify(this.unlockedAchievements));
        localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
    }

    // ========================================
    // 🎯 Event Listeners
    // ========================================
    initEventListeners() {
        // Modal controls
        const addBtn = document.getElementById('addBtn');
        const closeModal = document.getElementById('closeModal');
        const modal = document.getElementById('transactionModal');
        const form = document.getElementById('transactionForm');

        addBtn.addEventListener('click', () => this.openModal());
        closeModal.addEventListener('click', () => this.closeModal());
        
        // Close modal on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        darkModeToggle.addEventListener('click', () => this.toggleDarkMode());

        // Profile button
        const profileBtn = document.getElementById('profileBtn');
        profileBtn.addEventListener('click', () => this.showProfile());

        // Settings button
        const settingsBtn = document.getElementById('settingsBtn');
        settingsBtn.addEventListener('click', () => this.showSettings());

        // View All button
        const viewAllBtn = document.getElementById('viewAllBtn');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => this.viewAllTransactions());
        }

        // Profile modal close
        const closeProfile = document.getElementById('closeProfile');
        closeProfile.addEventListener('click', () => this.closeProfile());

        // Settings modal close
        const closeSettings = document.getElementById('closeSettings');
        closeSettings.addEventListener('click', () => this.closeSettings());

        // Settings - Dark mode toggle
        const settingDarkMode = document.getElementById('settingDarkMode');
        settingDarkMode.addEventListener('change', (e) => {
            if (e.target.checked !== this.darkMode) {
                this.toggleDarkMode();
            }
        });

        // Settings - Export data
        const exportDataBtn = document.getElementById('exportDataBtn');
        exportDataBtn.addEventListener('click', () => this.exportData());

        // Settings - Clear data
        const clearDataBtn = document.getElementById('clearDataBtn');
        clearDataBtn.addEventListener('click', () => this.clearAllData());

        // Settings - Generate random data
        const generateDataBtn = document.getElementById('generateDataBtn');
        generateDataBtn.addEventListener('click', () => this.generateRandomData());

        // Close modals on outside click
        const profileModal = document.getElementById('profileModal');
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                this.closeProfile();
            }
        });

        const settingsModal = document.getElementById('settingsModal');
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                this.closeSettings();
            }
        });

        // Set today's date as default
        document.getElementById('date').valueAsDate = new Date();
    }

    // ========================================
    // 📝 Transaction Operations
    // ========================================
    openModal(transaction = null) {
        const modal = document.getElementById('transactionModal');
        const form = document.getElementById('transactionForm');
        const modalTitle = document.getElementById('modalTitle');

        if (transaction) {
            modalTitle.textContent = 'Edit Transaction';
            form.dataset.editId = transaction.id;
            this.populateForm(transaction);
        } else {
            modalTitle.textContent = 'Add Transaction';
            form.reset();
            delete form.dataset.editId;
            document.getElementById('date').valueAsDate = new Date();
        }

        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('transactionModal');
        modal.classList.remove('active');
    }

    populateForm(transaction) {
        document.getElementById('typeExpense').checked = transaction.type === 'expense';
        document.getElementById('typeIncome').checked = transaction.type === 'income';
        document.getElementById('amount').value = transaction.amount;
        document.getElementById('category').value = transaction.category;
        document.getElementById('date').value = transaction.date;
        document.getElementById('notes').value = transaction.notes || '';
        document.getElementById('recurring').checked = transaction.recurring || false;
    }

    handleFormSubmit() {
        const form = document.getElementById('transactionForm');
        const editId = form.dataset.editId;

        // Validate amount
        const amount = parseFloat(document.getElementById('amount').value);
        if (isNaN(amount) || amount <= 0) {
            this.showToast('Please enter a valid amount greater than 0', 'warning');
            return;
        }

        // Validate category
        const category = document.getElementById('category').value;
        if (!category) {
            this.showToast('Please select a category', 'warning');
            return;
        }

        const transaction = {
            id: editId || Date.now().toString(),
            type: document.querySelector('input[name="type"]:checked').value,
            amount: amount,
            category: category,
            date: document.getElementById('date').value,
            notes: document.getElementById('notes').value,
            recurring: document.getElementById('recurring').checked,
            createdAt: editId ? this.transactions.find(t => t.id === editId).createdAt : new Date().toISOString()
        };

        if (editId) {
            // Update existing transaction
            const index = this.transactions.findIndex(t => t.id === editId);
            this.transactions[index] = transaction;
            this.showToast('Transaction updated successfully!', 'success');
        } else {
            // Add new transaction
            this.transactions.unshift(transaction);
            this.addXP(10, 'Logged a transaction');
            this.showToast('Transaction added successfully! +10 XP', 'success');
        }

        this.saveData();
        this.updateDashboard();
        this.renderTransactions();
        this.updateBudgets();
        this.updateGamification();
        this.checkAllChallenges();
        this.checkAchievements();
        
        // Update charts if available
        if (window.chartManager) {
            chartManager.updateCharts();
        }
        
        this.closeModal();
    }

    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveData();
            this.updateDashboard();
            this.renderTransactions();
            this.updateBudgets();
            this.checkAllChallenges();
            
            // Update charts if available
            if (window.chartManager) {
                chartManager.updateCharts();
            }
            
            this.showToast('Transaction deleted', 'info');
        }
    }

    // ========================================
    // 📊 Dashboard Calculations
    // ========================================
    updateDashboard() {
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

        const monthlyTransactions = this.transactions.filter(t => 
            t.date.startsWith(currentMonth)
        );

        const monthlyIncome = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const monthlyExpenses = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalBalance = this.calculateTotalBalance();

        // Update UI
        document.getElementById('totalBalance').textContent = `₹${this.formatNumber(totalBalance)}`;
        document.getElementById('monthlyIncome').textContent = `₹${this.formatNumber(monthlyIncome)}`;
        document.getElementById('monthlyExpense').textContent = `₹${this.formatNumber(monthlyExpenses)}`;

        // Update card colors
        const balanceCard = document.querySelector('.balance-card');
        if (totalBalance < 0) {
            balanceCard.style.borderLeft = '4px solid var(--danger)';
        } else {
            balanceCard.style.borderLeft = '4px solid var(--success)';
        }
    }

    calculateTotalBalance() {
        return this.transactions.reduce((balance, t) => {
            return t.type === 'income' 
                ? balance + t.amount 
                : balance - t.amount;
        }, 0);
    }

    // ========================================
    // 📋 Transaction Rendering
    // ========================================
    renderTransactions(showAll = false) {
        const container = document.getElementById('transactionList');
        
        if (this.transactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No transactions yet. Start tracking your expenses!</p>
                </div>
            `;
            return;
        }

        const transactionsToShow = showAll ? this.transactions : this.transactions.slice(0, 10);
        
        container.innerHTML = transactionsToShow.map(t => `
            <div class="transaction-item ${t.type}" data-id="${t.id}">
                <div class="transaction-icon">${this.getCategoryIcon(t.category)}</div>
                <div class="transaction-details">
                    <div class="transaction-category">${this.capitalizeFirst(t.category)}</div>
                    <div class="transaction-date">${this.formatDate(t.date)}</div>
                    ${t.notes ? `<div class="transaction-notes">${t.notes}</div>` : ''}
                </div>
                <div class="transaction-amount ${t.type}">
                    ${t.type === 'income' ? '+' : '-'}₹${this.formatNumber(t.amount)}
                </div>
                <div class="transaction-actions">
                    <button class="action-btn edit-btn" onclick="app.editTransaction('${t.id}')">✏️</button>
                    <button class="action-btn delete-btn" onclick="app.deleteTransaction('${t.id}')">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (transaction) {
            this.openModal(transaction);
        }
    }

    // ========================================
    // 💰 Budget Management
    // ========================================
    updateBudgets() {
        const currentMonth = new Date().toISOString().slice(0, 7);

        // Reset spent amounts
        Object.keys(this.budgets).forEach(category => {
            this.budgets[category].spent = 0;
        });

        // Calculate spent for current month
        this.transactions
            .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
            .forEach(t => {
                if (this.budgets[t.category]) {
                    this.budgets[t.category].spent += t.amount;
                }
            });

        this.saveData();
        this.renderBudgets();
        this.checkBudgetAlerts();
    }

    renderBudgets() {
        const container = document.getElementById('budgetList');
        
        container.innerHTML = Object.entries(this.budgets).map(([category, data]) => {
            const percentage = Math.min((data.spent / data.limit) * 100, 100);
            const status = this.getBudgetStatus(percentage);
            
            return `
                <div class="budget-item">
                    <div class="budget-header">
                        <span class="budget-category">${this.getCategoryIcon(category)} ${this.capitalizeFirst(category)}</span>
                        <span class="budget-amount">₹${this.formatNumber(data.spent)} / ₹${this.formatNumber(data.limit)}</span>
                    </div>
                    <div class="budget-bar">
                        <div class="budget-progress ${status}" style="width: ${percentage}%"></div>
                    </div>
                    <div class="budget-percentage">${percentage.toFixed(0)}% used</div>
                </div>
            `;
        }).join('');
    }

    getBudgetStatus(percentage) {
        if (percentage >= 100) return 'danger';
        if (percentage >= 80) return 'warning';
        return 'success';
    }

    checkBudgetAlerts() {
        Object.entries(this.budgets).forEach(([category, data]) => {
            const percentage = (data.spent / data.limit) * 100;
            
            if (percentage >= 100 && !this.hasAlertedToday(category, 'exceeded')) {
                this.showToast(`⚠️ Budget exceeded for ${category}!`, 'danger');
                this.setAlertToday(category, 'exceeded');
                this.adjustKarma(-10);
            } else if (percentage >= 80 && percentage < 100 && !this.hasAlertedToday(category, 'warning')) {
                this.showToast(`⚠️ You've used ${percentage.toFixed(0)}% of your ${category} budget`, 'warning');
                this.setAlertToday(category, 'warning');
            }
        });

        // Check if all categories are under budget
        const allUnderBudget = Object.values(this.budgets).every(b => b.spent < b.limit);
        if (allUnderBudget && this.transactions.length > 0) {
            this.addXP(50, 'All budgets under control!');
        }
    }

    hasAlertedToday(category, type) {
        const today = new Date().toISOString().slice(0, 10);
        const alertKey = `alert_${category}_${type}_${today}`;
        return localStorage.getItem(alertKey) === 'true';
    }

    setAlertToday(category, type) {
        const today = new Date().toISOString().slice(0, 10);
        const alertKey = `alert_${category}_${type}_${today}`;
        localStorage.setItem(alertKey, 'true');
    }

    // ========================================
    // 🎮 Gamification System
    // ========================================
    updateGamification() {
        const xpForNextLevel = this.userData.level * 500;
        const xpPercentage = (this.userData.xp / xpForNextLevel) * 100;

        document.getElementById('currentLevel').textContent = this.userData.level;
        document.getElementById('xpText').textContent = `${this.userData.xp} / ${xpForNextLevel} XP`;
        document.getElementById('xpProgress').style.width = `${xpPercentage}%`;
        document.getElementById('karmaScore').textContent = this.userData.karma;

        // Update karma color
        const karmaElement = document.getElementById('karmaScore');
        if (this.userData.karma >= 80) {
            karmaElement.style.color = 'var(--success)';
        } else if (this.userData.karma >= 50) {
            karmaElement.style.color = 'var(--warning)';
        } else {
            karmaElement.style.color = 'var(--danger)';
        }
    }

    addXP(amount, reason) {
        this.userData.xp += amount;
        const xpForNextLevel = this.userData.level * 500;

        if (this.userData.xp >= xpForNextLevel) {
            this.levelUp();
        }

        this.saveData();
        this.updateGamification();
    }

    levelUp() {
        this.userData.level++;
        this.userData.xp = 0;
        this.showToast(`🎉 Level Up! You're now Level ${this.userData.level}!`, 'success');
        this.playLevelUpAnimation();
        this.checkAchievements();
    }

    adjustKarma(amount) {
        this.userData.karma = Math.max(0, Math.min(100, this.userData.karma + amount));
        this.saveData();
        this.updateGamification();
    }

    playLevelUpAnimation() {
        // Simple celebration animation
        const xpBar = document.querySelector('.xp-container');
        xpBar.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            xpBar.style.animation = '';
        }, 500);
    }

    // ========================================
    // 🔁 Recurring Transactions
    // ========================================
    checkRecurringTransactions() {
        const today = new Date().toISOString().slice(0, 10);
        const recurringTransactions = this.transactions.filter(t => t.recurring);

        recurringTransactions.forEach(t => {
            const lastDate = new Date(t.date);
            const nextDate = new Date(lastDate);
            nextDate.setMonth(nextDate.getMonth() + 1);

            const nextDateString = nextDate.toISOString().slice(0, 10);

            if (nextDateString === today && !this.hasRecurredToday(t.id)) {
                this.addRecurringTransaction(t);
            }
        });
    }

    hasRecurredToday(transactionId) {
        const today = new Date().toISOString().slice(0, 10);
        const recurKey = `recur_${transactionId}_${today}`;
        return localStorage.getItem(recurKey) === 'true';
    }

    addRecurringTransaction(originalTransaction) {
        const newTransaction = {
            ...originalTransaction,
            id: Date.now().toString(),
            date: new Date().toISOString().slice(0, 10),
            createdAt: new Date().toISOString()
        };

        this.transactions.unshift(newTransaction);
        this.saveData();
        
        const today = new Date().toISOString().slice(0, 10);
        const recurKey = `recur_${originalTransaction.id}_${today}`;
        localStorage.setItem(recurKey, 'true');

        this.showToast(`🔁 Recurring transaction added: ₹${newTransaction.amount} ${newTransaction.category}`, 'info');
        this.updateDashboard();
        this.renderTransactions();
    }

    // ========================================
    // 🛠️ Utility Functions
    // ========================================
    formatNumber(num) {
        return new Intl.NumberFormat('en-IN').format(num.toFixed(2));
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-IN', options);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getCategoryIcon(category) {
        const icons = {
            food: '🍔',
            transport: '🚗',
            entertainment: '🎮',
            bills: '💡',
            shopping: '🛍️',
            health: '⚕️',
            other: '📌'
        };
        return icons[category] || '📌';
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ========================================
    // 🌙 Dark Mode
    // ========================================
    initDarkMode() {
        if (this.darkMode) {
            document.body.classList.add('dark-mode');
            this.updateDarkModeIcon();
        }
    }

    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        document.body.classList.toggle('dark-mode');
        this.updateDarkModeIcon();
        this.saveData();
        
        const message = this.darkMode ? '🌙 Dark mode enabled' : '☀️ Light mode enabled';
        this.showToast(message, 'info');
    }

    updateDarkModeIcon() {
        const toggle = document.getElementById('darkModeToggle');
        toggle.textContent = this.darkMode ? '☀️' : '🌙';
    }

    // ========================================
    // 👤 Profile & Settings
    // ========================================
    showProfile() {
        const stats = this.calculateProfileStats();
        const modal = document.getElementById('profileModal');
        
        // Update profile data
        document.getElementById('profileLevel').textContent = this.userData.level;
        document.getElementById('profileXP').textContent = `${this.userData.xp} / ${this.userData.level * 500}`;
        document.getElementById('profileKarma').textContent = this.userData.karma;
        document.getElementById('profileBalance').textContent = `₹${this.formatNumber(stats.balance)}`;
        document.getElementById('profileIncome').textContent = `₹${this.formatNumber(stats.totalIncome)}`;
        document.getElementById('profileExpenses').textContent = `₹${this.formatNumber(stats.totalExpenses)}`;
        document.getElementById('profileTransCount').textContent = stats.transactionCount;
        
        // Update badges
        const badgesContainer = document.getElementById('profileBadges');
        if (this.userData.badges && this.userData.badges.length > 0) {
            badgesContainer.innerHTML = this.userData.badges.map(badge => 
                `<span class="badge">${badge}</span>`
            ).join('');
        } else {
            badgesContainer.innerHTML = '<p class="text-muted">Complete challenges to earn badges!</p>';
        }
        
        modal.classList.add('active');
    }

    showSettings() {
        const modal = document.getElementById('settingsModal');
        
        // Update dark mode toggle
        document.getElementById('settingDarkMode').checked = this.darkMode;
        
        // Update budget settings
        const budgetSettings = document.getElementById('budgetSettings');
        budgetSettings.innerHTML = Object.entries(this.budgets).map(([category, data]) => `
            <div class="budget-setting">
                <label>${this.getCategoryIcon(category)} ${this.capitalizeFirst(category)}</label>
                <input type="number" 
                       id="budget_${category}" 
                       value="${data.limit}" 
                       min="0" 
                       step="100"
                       data-category="${category}">
            </div>
        `).join('');
        
        // Add event listeners to budget inputs
        Object.keys(this.budgets).forEach(category => {
            const input = document.getElementById(`budget_${category}`);
            input.addEventListener('change', (e) => {
                this.budgets[category].limit = parseFloat(e.target.value);
                this.saveData();
                this.updateBudgets();
                this.showToast(`Budget for ${category} updated!`, 'success');
            });
        });
        
        modal.classList.add('active');
    }

    closeProfile() {
        const modal = document.getElementById('profileModal');
        modal.classList.remove('active');
    }

    closeSettings() {
        const modal = document.getElementById('settingsModal');
        modal.classList.remove('active');
    }

    exportData() {
        const data = {
            transactions: this.transactions,
            budgets: this.budgets,
            userData: this.userData,
            exportDate: new Date().toISOString()
        };
        
        const csvContent = this.convertToCSV(this.transactions);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expense-tracker-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        
        this.showToast('📥 Data exported successfully!', 'success');
    }

    convertToCSV(transactions) {
        const headers = ['Date', 'Type', 'Category', 'Amount', 'Notes'];
        const rows = transactions.map(t => [
            t.date,
            t.type,
            t.category,
            t.amount,
            t.notes || ''
        ]);
        
        const csvRows = [headers, ...rows].map(row => 
            row.map(cell => `"${cell}"`).join(',')
        ).join('\n');
        
        return csvRows;
    }

    clearAllData() {
        if (confirm('⚠️ Are you sure you want to delete ALL data? This cannot be undone!')) {
            if (confirm('This will delete all transactions, budgets, and progress. Continue?')) {
                localStorage.clear();
                this.showToast('🗑️ All data cleared!', 'warning');
                setTimeout(() => location.reload(), 1000);
            }
        }
    }

    calculateProfileStats() {
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        return {
            totalIncome,
            totalExpenses,
            balance: totalIncome - totalExpenses,
            transactionCount: this.transactions.length,
            level: this.userData.level,
            xp: this.userData.xp,
            karma: this.userData.karma
        };
    }

    viewAllTransactions() {
        console.log('=== ALL TRANSACTIONS ===');
        console.log(`Total: ${this.transactions.length} transactions`);
        console.table(this.transactions.map(t => ({
            Date: t.date,
            Type: t.type,
            Amount: `₹${this.formatNumber(t.amount)}`,
            Category: t.category,
            Notes: t.notes || '-'
        })));
        
        this.showToast(`📊 Showing all ${this.transactions.length} transactions in console`, 'info');
        this.renderTransactions(true);
    }

    // ========================================
    // 🎯 Daily Challenges System
    // ========================================
    initDailyChallenges() {
        const today = new Date().toISOString().slice(0, 10);
        
        // Check if we need to generate new challenges
        if (this.challenges.length === 0 || this.challenges[0].date !== today) {
            this.generateDailyChallenges(today);
        }
    }

    generateDailyChallenges(date) {
        const challengePool = [
            {
                id: 'log_3_transactions',
                icon: '📝',
                title: 'Transaction Logger',
                description: 'Log at least 3 transactions today',
                reward: 100,
                checkFunction: () => {
                    const today = new Date().toISOString().slice(0, 10);
                    const todayTransactions = this.transactions.filter(t => t.date === today);
                    return todayTransactions.length >= 3;
                }
            },
            {
                id: 'stay_under_budget',
                icon: '💰',
                title: 'Budget Keeper',
                description: 'Keep all category budgets under 90%',
                reward: 150,
                checkFunction: () => {
                    return Object.values(this.budgets).every(b => {
                        const percentage = (b.spent / b.limit) * 100;
                        return percentage < 90;
                    });
                }
            },
            {
                id: 'no_expenses',
                icon: '🚫',
                title: 'No-Spend Day',
                description: 'Don\'t add any expenses today',
                reward: 200,
                checkFunction: () => {
                    const today = new Date().toISOString().slice(0, 10);
                    const todayExpenses = this.transactions.filter(t => 
                        t.type === 'expense' && t.date === today
                    );
                    return todayExpenses.length === 0;
                }
            },
            {
                id: 'track_income',
                icon: '💵',
                title: 'Income Tracker',
                description: 'Add at least one income entry today',
                reward: 80,
                checkFunction: () => {
                    const today = new Date().toISOString().slice(0, 10);
                    const todayIncome = this.transactions.filter(t => 
                        t.type === 'income' && t.date === today
                    );
                    return todayIncome.length >= 1;
                }
            },
            {
                id: 'categorize_all',
                icon: '🏷️',
                title: 'Perfect Categorization',
                description: 'All today\'s transactions have proper categories',
                reward: 120,
                checkFunction: () => {
                    const today = new Date().toISOString().slice(0, 10);
                    const todayTransactions = this.transactions.filter(t => t.date === today);
                    return todayTransactions.length > 0 && 
                           todayTransactions.every(t => t.category && t.category !== 'other');
                }
            },
            {
                id: 'morning_tracker',
                icon: '🌅',
                title: 'Early Bird',
                description: 'Log your first transaction before noon',
                reward: 90,
                checkFunction: () => {
                    const today = new Date().toISOString().slice(0, 10);
                    const todayTransactions = this.transactions.filter(t => t.date === today);
                    if (todayTransactions.length === 0) return false;
                    
                    const firstTransaction = todayTransactions.reduce((earliest, t) => {
                        return new Date(t.createdAt) < new Date(earliest.createdAt) ? t : earliest;
                    });
                    
                    const hour = new Date(firstTransaction.createdAt).getHours();
                    return hour < 12;
                }
            }
        ];

        // Select 3 random challenges
        const shuffled = challengePool.sort(() => 0.5 - Math.random());
        this.challenges = shuffled.slice(0, 3).map(challenge => ({
            ...challenge,
            date: date,
            completed: false
        }));

        this.saveData();
    }

    renderChallenges() {
        const container = document.getElementById('challengesList');
        const dateElement = document.getElementById('challengesDate');
        
        if (!container) return;

        const today = new Date();
        if (dateElement) {
            dateElement.textContent = today.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }

        if (this.challenges.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No challenges available. Check back tomorrow!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.challenges.map(challenge => {
            const isCompleted = challenge.completed || challenge.checkFunction();
            
            // Update completion status
            if (isCompleted && !challenge.completed) {
                this.completeChallenge(challenge.id);
            }

            return `
                <div class="challenge-item ${isCompleted ? 'completed' : ''}">
                    <div class="challenge-icon">${challenge.icon}</div>
                    <div class="challenge-content">
                        <div class="challenge-title">${challenge.title}</div>
                        <div class="challenge-description">${challenge.description}</div>
                    </div>
                    <div class="challenge-reward">
                        <span>⭐ +${challenge.reward} XP</span>
                    </div>
                    ${isCompleted ? '<div class="challenge-check">✅</div>' : ''}
                </div>
            `;
        }).join('');
    }

    completeChallenge(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (!challenge || challenge.completed) return;

        challenge.completed = true;
        this.addXP(challenge.reward, `Completed: ${challenge.title}`);
        this.saveData();
        this.renderChallenges();
        this.checkAchievements();
        
        this.showToast(`🎉 Challenge completed! +${challenge.reward} XP`, 'success');
    }

    checkAllChallenges() {
        this.challenges.forEach(challenge => {
            if (!challenge.completed && challenge.checkFunction()) {
                this.completeChallenge(challenge.id);
            }
        });
        this.renderChallenges();
    }

    // ========================================
    // 🏆 Achievements System
    // ========================================
    initAchievements() {
        this.achievements = [
            // Bronze Tier - Beginner Achievements
            {
                id: 'first_transaction',
                name: 'First Steps',
                description: 'Add your first transaction',
                icon: '🎯',
                tier: 'bronze',
                requirement: 'Add 1 transaction',
                checkFunction: () => this.transactions.length >= 1
            },
            {
                id: 'ten_transactions',
                name: 'Getting Started',
                description: 'Record 10 transactions',
                icon: '📝',
                tier: 'bronze',
                requirement: 'Add 10 transactions',
                checkFunction: () => this.transactions.length >= 10
            },
            {
                id: 'first_income',
                name: 'Money Maker',
                description: 'Record your first income',
                icon: '💵',
                tier: 'bronze',
                requirement: 'Add 1 income transaction',
                checkFunction: () => this.transactions.some(t => t.type === 'income')
            },
            {
                id: 'budget_setter',
                name: 'Budget Planner',
                description: 'Set a custom budget',
                icon: '📊',
                tier: 'bronze',
                requirement: 'Modify any budget limit',
                checkFunction: () => {
                    const defaults = { food: 5000, transport: 3000, entertainment: 2000, bills: 8000, shopping: 4000, health: 3000, other: 2000 };
                    return Object.keys(this.budgets).some(cat => this.budgets[cat].limit !== defaults[cat]);
                }
            },
            
            // Silver Tier - Intermediate Achievements
            {
                id: 'fifty_transactions',
                name: 'Consistent Tracker',
                description: 'Record 50 transactions',
                icon: '📈',
                tier: 'silver',
                requirement: 'Add 50 transactions',
                checkFunction: () => this.transactions.length >= 50
            },
            {
                id: 'level_5',
                name: 'Rising Star',
                description: 'Reach Level 5',
                icon: '⭐',
                tier: 'silver',
                requirement: 'Reach Level 5',
                checkFunction: () => this.userData.level >= 5
            },
            {
                id: 'challenge_master',
                name: 'Challenge Master',
                description: 'Complete 10 daily challenges',
                icon: '🎖️',
                tier: 'silver',
                requirement: 'Complete 10 daily challenges',
                checkFunction: () => {
                    const completedChallenges = this.challenges.filter(c => c.completed).length;
                    return completedChallenges >= 10;
                }
            },
            {
                id: 'budget_keeper',
                name: 'Budget Keeper',
                description: 'Stay within budget for all categories',
                icon: '🎯',
                tier: 'silver',
                requirement: 'All budgets under 100% spent',
                checkFunction: () => {
                    return Object.keys(this.budgets).every(cat => {
                        const budget = this.budgets[cat];
                        return budget.spent <= budget.limit;
                    });
                }
            },
            
            // Gold Tier - Advanced Achievements
            {
                id: 'hundred_transactions',
                name: 'Financial Pro',
                description: 'Record 100 transactions',
                icon: '🏅',
                tier: 'gold',
                requirement: 'Add 100 transactions',
                checkFunction: () => this.transactions.length >= 100
            },
            {
                id: 'level_10',
                name: 'Master Tracker',
                description: 'Reach Level 10',
                icon: '👑',
                tier: 'gold',
                requirement: 'Reach Level 10',
                checkFunction: () => this.userData.level >= 10
            },
            {
                id: 'perfect_karma',
                name: 'Perfect Balance',
                description: 'Maintain 100 Karma',
                icon: '☯️',
                tier: 'gold',
                requirement: 'Keep Karma at 100',
                checkFunction: () => this.userData.karma === 100
            },
            {
                id: 'savings_master',
                name: 'Savings Champion',
                description: 'Have a positive balance of ₹10,000+',
                icon: '💰',
                tier: 'gold',
                requirement: 'Maintain ₹10,000+ balance',
                checkFunction: () => {
                    const balance = this.transactions.reduce((sum, t) => {
                        return t.type === 'income' ? sum + t.amount : sum - t.amount;
                    }, 0);
                    return balance >= 10000;
                }
            },
            
            // Platinum Tier - Elite Achievements
            {
                id: 'year_veteran',
                name: 'Year Veteran',
                description: 'Use the app for 365 days',
                icon: '🗓️',
                tier: 'platinum',
                requirement: 'Track expenses for 1 year',
                checkFunction: () => {
                    if (this.transactions.length === 0) return false;
                    const oldest = new Date(Math.min(...this.transactions.map(t => new Date(t.date))));
                    const daysDiff = (new Date() - oldest) / (1000 * 60 * 60 * 24);
                    return daysDiff >= 365;
                }
            },
            {
                id: 'five_hundred_transactions',
                name: 'Ultimate Tracker',
                description: 'Record 500 transactions',
                icon: '🏆',
                tier: 'platinum',
                requirement: 'Add 500 transactions',
                checkFunction: () => this.transactions.length >= 500
            },
            {
                id: 'level_20',
                name: 'Legendary',
                description: 'Reach Level 20',
                icon: '💎',
                tier: 'platinum',
                requirement: 'Reach Level 20',
                checkFunction: () => this.userData.level >= 20
            },
            {
                id: 'challenge_legend',
                name: 'Challenge Legend',
                description: 'Complete 50 daily challenges',
                icon: '🏅',
                tier: 'platinum',
                requirement: 'Complete 50 daily challenges',
                checkFunction: () => {
                    const completedChallenges = this.challenges.filter(c => c.completed).length;
                    return completedChallenges >= 50;
                }
            }
        ];
    }

    checkAchievements() {
        let newUnlocks = [];
        
        this.achievements.forEach(achievement => {
            const alreadyUnlocked = this.unlockedAchievements.some(a => a.id === achievement.id);
            
            if (!alreadyUnlocked && achievement.checkFunction()) {
                const unlockedAchievement = {
                    ...achievement,
                    unlockedAt: new Date().toISOString()
                };
                this.unlockedAchievements.push(unlockedAchievement);
                newUnlocks.push(achievement);
            }
        });
        
        if (newUnlocks.length > 0) {
            this.saveData();
            this.renderAchievements();
            
            // Show notification for new achievements
            newUnlocks.forEach(achievement => {
                this.showToast(`🏆 Achievement Unlocked: ${achievement.name}!`, 'success');
            });
        }
    }

    renderAchievements() {
        const achievementsList = document.getElementById('achievementsList');
        const achievementsStats = document.querySelector('.achievements-stats');
        
        if (!achievementsList || !achievementsStats) return;
        
        const unlockedCount = this.unlockedAchievements.length;
        const totalCount = this.achievements.length;
        achievementsStats.textContent = `${unlockedCount} / ${totalCount} Unlocked`;
        
        achievementsList.innerHTML = this.achievements.map(achievement => {
            const unlocked = this.unlockedAchievements.find(a => a.id === achievement.id);
            const isUnlocked = !!unlocked;
            
            // Calculate progress
            let progress = 0;
            let progressText = '';
            
            // Get current progress based on achievement type
            if (achievement.id.includes('transaction')) {
                const target = parseInt(achievement.requirement.match(/\d+/)[0]);
                progress = Math.min((this.transactions.length / target) * 100, 100);
                progressText = `${this.transactions.length} / ${target}`;
            } else if (achievement.id.includes('level')) {
                const target = parseInt(achievement.requirement.match(/\d+/)[0]);
                progress = Math.min((this.userData.level / target) * 100, 100);
                progressText = `Level ${this.userData.level} / ${target}`;
            } else if (achievement.id.includes('challenge')) {
                const target = parseInt(achievement.requirement.match(/\d+/)[0]);
                const completed = this.challenges.filter(c => c.completed).length;
                progress = Math.min((completed / target) * 100, 100);
                progressText = `${completed} / ${target}`;
            } else if (isUnlocked) {
                progress = 100;
                progressText = 'Completed';
            }
            
            const unlockDate = unlocked ? new Date(unlocked.unlockedAt).toLocaleDateString() : '';
            
            return `
                <div class="achievement-item ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-header">
                        <div class="achievement-badge">${achievement.icon}</div>
                        <div class="achievement-info">
                            <div class="achievement-name">${achievement.name}</div>
                            <span class="achievement-tier ${achievement.tier}">${achievement.tier}</span>
                        </div>
                    </div>
                    <p class="achievement-description">${achievement.description}</p>
                    <p class="achievement-requirement">📋 ${achievement.requirement}</p>
                    
                    ${!isUnlocked && progress > 0 ? `
                        <div class="achievement-progress">
                            <div class="achievement-progress-bar">
                                <div class="achievement-progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <div class="achievement-progress-text">${progressText}</div>
                        </div>
                    ` : ''}
                    
                    <div class="achievement-status ${isUnlocked ? 'unlocked' : 'locked'}">
                        ${isUnlocked ? '✅ Unlocked' : '🔒 Locked'}
                    </div>
                    
                    ${isUnlocked ? `
                        <div class="achievement-unlock-date">Unlocked on ${unlockDate}</div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    // ========================================
    // 🎲 Generate Random Data (Testing)
    // ========================================
    generateRandomData() {
        const categories = ['food', 'transport', 'entertainment', 'bills', 'shopping', 'health', 'other'];
        const expenseDescriptions = {
            food: ['Grocery shopping', 'Restaurant dinner', 'Coffee', 'Lunch', 'Snacks', 'Fast food'],
            transport: ['Uber ride', 'Fuel', 'Bus ticket', 'Metro card recharge', 'Parking fee'],
            entertainment: ['Movie tickets', 'Concert', 'Games', 'Streaming subscription', 'Books'],
            bills: ['Electricity bill', 'Internet bill', 'Phone bill', 'Water bill', 'Rent'],
            shopping: ['Clothes', 'Electronics', 'Shoes', 'Accessories', 'Gifts'],
            health: ['Medicine', 'Doctor visit', 'Gym membership', 'Vitamins', 'Health checkup'],
            other: ['Miscellaneous', 'Emergency', 'Repairs', 'Donation']
        };
        
        const incomeDescriptions = ['Salary', 'Freelance work', 'Bonus', 'Gift received', 'Refund', 'Side project'];

        // Generate transactions for last 2 months
        const today = new Date();
        const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        
        const transactions = [];
        
        // Generate 80-120 random transactions
        const numTransactions = Math.floor(Math.random() * 40) + 80;
        
        for (let i = 0; i < numTransactions; i++) {
            // Random date in last 2 months
            const randomDate = new Date(
                twoMonthsAgo.getTime() + 
                Math.random() * (today.getTime() - twoMonthsAgo.getTime())
            );
            
            // 20% chance of income, 80% chance of expense
            const isIncome = Math.random() < 0.2;
            const type = isIncome ? 'income' : 'expense';
            
            let category, amount, notes;
            
            if (isIncome) {
                category = 'salary';
                amount = Math.floor(Math.random() * 20000) + 5000; // ₹5,000 - ₹25,000
                notes = incomeDescriptions[Math.floor(Math.random() * incomeDescriptions.length)];
            } else {
                category = categories[Math.floor(Math.random() * categories.length)];
                // Different amount ranges for different categories
                if (category === 'bills') {
                    amount = Math.floor(Math.random() * 3000) + 500; // ₹500 - ₹3,500
                } else if (category === 'food') {
                    amount = Math.floor(Math.random() * 800) + 100; // ₹100 - ₹900
                } else if (category === 'shopping') {
                    amount = Math.floor(Math.random() * 2000) + 200; // ₹200 - ₹2,200
                } else {
                    amount = Math.floor(Math.random() * 1000) + 100; // ₹100 - ₹1,100
                }
                notes = expenseDescriptions[category][Math.floor(Math.random() * expenseDescriptions[category].length)];
            }
            
            transactions.push({
                id: `random_${Date.now()}_${i}`,
                type: type,
                amount: amount,
                category: category,
                date: randomDate.toISOString().split('T')[0],
                notes: notes,
                recurring: Math.random() < 0.1, // 10% chance of recurring
                createdAt: randomDate.toISOString()
            });
        }
        
        // Sort by date (newest first)
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Add to existing transactions
        this.transactions = [...transactions, ...this.transactions];
        
        // Add XP for all transactions
        this.addXP(transactions.length * 10, 'Generated sample data');
        
        this.saveData();
        this.updateDashboard();
        this.renderTransactions();
        this.updateBudgets();
        this.updateGamification();
        this.checkAllChallenges();
        this.checkAchievements();
        
        // Update charts
        if (window.chartManager) {
            chartManager.updateCharts();
        }
        
        this.showToast(`✅ Generated ${transactions.length} random transactions for the last 2 months!`, 'success');
    }
}

// ========================================
// 🚀 Initialize App
// ========================================
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ExpenseTracker();
});
