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
        this.darkMode = false;
        
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
    }

    // ========================================
    // 💾 Data Management
    // ========================================
    loadData() {
        const savedTransactions = localStorage.getItem('transactions');
        const savedBudgets = localStorage.getItem('budgets');
        const savedUserData = localStorage.getItem('userData');
        const savedChallenges = localStorage.getItem('challenges');
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

        if (savedDarkMode) {
            this.darkMode = JSON.parse(savedDarkMode);
        }
    }

    saveData() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
        localStorage.setItem('budgets', JSON.stringify(this.budgets));
        localStorage.setItem('userData', JSON.stringify(this.userData));
        localStorage.setItem('challenges', JSON.stringify(this.challenges));
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
        
        this.showToast(`
📊 Your Stats:
Level: ${this.userData.level}
XP: ${this.userData.xp}
Karma: ${this.userData.karma}
Transactions: ${this.transactions.length}
        `.trim(), 'info');
        
        console.log('=== USER PROFILE ===');
        console.log('Level:', this.userData.level);
        console.log('XP:', this.userData.xp);
        console.log('Karma:', this.userData.karma);
        console.log('Total Transactions:', this.transactions.length);
        console.log('Total Balance:', this.formatNumber(this.calculateTotalBalance()));
        console.log('Badges:', this.userData.badges);
        console.log('===================');
    }

    showSettings() {
        this.showToast('⚙️ Settings panel coming soon!', 'info');
        
        console.log('=== SETTINGS ===');
        console.log('Dark Mode:', this.darkMode ? 'Enabled' : 'Disabled');
        console.log('Budget Limits:');
        Object.entries(this.budgets).forEach(([category, data]) => {
            console.log(`  ${category}: ₹${this.formatNumber(data.limit)}`);
        });
        console.log('================');
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
}

// ========================================
// 🚀 Initialize App
// ========================================
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ExpenseTracker();
});
