// ========================================
// 📊 Charts & Data Visualization
// ========================================

class ChartManager {
    constructor() {
        this.categoryChart = null;
        this.weeklyChart = null;
        this.init();
    }

    init() {
        // Wait for app to load
        setTimeout(() => {
            if (window.app) {
                this.renderCategoryChart();
                this.renderWeeklyChart();
            }
        }, 500);
    }

    // ========================================
    // 🥧 Category Pie Chart
    // ========================================
    renderCategoryChart() {
        const ctx = document.getElementById('categoryPieChart');
        if (!ctx || !window.app) return;

        // Get current month expenses by category
        const currentMonth = new Date().toISOString().slice(0, 7);
        const monthlyExpenses = app.transactions.filter(t => 
            t.type === 'expense' && t.date.startsWith(currentMonth)
        );

        // Aggregate by category
        const categoryData = {};
        monthlyExpenses.forEach(t => {
            categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
        });

        const labels = Object.keys(categoryData).map(cat => app.capitalizeFirst(cat));
        const data = Object.values(categoryData);
        const colors = this.getCategoryColors(Object.keys(categoryData));

        // Destroy existing chart
        if (this.categoryChart) {
            this.categoryChart.destroy();
        }

        // If no data, show empty state
        if (data.length === 0) {
            this.categoryChart = null;
            return;
        }

        // Create new chart
        this.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ₹${value.toLocaleString('en-IN')} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // ========================================
    // 📊 Weekly Bar Chart
    // ========================================
    renderWeeklyChart() {
        const ctx = document.getElementById('weeklyBarChart');
        if (!ctx || !window.app) return;

        // Get last 7 days of data
        const dailyData = this.getLast7DaysData();

        // Destroy existing chart
        if (this.weeklyChart) {
            this.weeklyChart.destroy();
        }

        // Create new chart
        this.weeklyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dailyData.labels,
                datasets: [
                    {
                        label: 'Expenses',
                        data: dailyData.expenses,
                        backgroundColor: 'rgba(244, 67, 54, 0.6)',
                        borderColor: 'rgba(244, 67, 54, 1)',
                        borderWidth: 2
                    },
                    {
                        label: 'Income',
                        data: dailyData.income,
                        backgroundColor: 'rgba(76, 175, 80, 0.6)',
                        borderColor: 'rgba(76, 175, 80, 1)',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString('en-IN');
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString('en-IN')}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // ========================================
    // 🛠️ Helper Functions
    // ========================================
    getLast7DaysData() {
        if (!window.app) {
            return { labels: [], expenses: [], income: [] };
        }
        
        const labels = [];
        const expenses = [];
        const income = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().slice(0, 10);
            
            // Format label
            const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
            labels.push(dayName);

            // Calculate expenses and income for this day
            const dayTransactions = app.transactions.filter(t => t.date === dateString);
            
            const dayExpenses = dayTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            
            const dayIncome = dayTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            expenses.push(dayExpenses);
            income.push(dayIncome);
        }

        return { labels, expenses, income };
    }

    getCategoryColors(categories) {
        const colorMap = {
            food: '#FF6384',
            transport: '#36A2EB',
            entertainment: '#FFCE56',
            bills: '#4BC0C0',
            shopping: '#9966FF',
            health: '#FF9F40',
            other: '#C9CBCF'
        };

        return categories.map(cat => colorMap[cat] || '#C9CBCF');
    }

    // ========================================
    // 🔄 Update Charts
    // ========================================
    updateCharts() {
        if (window.app) {
            this.renderCategoryChart();
            this.renderWeeklyChart();
        }
    }
}

// ========================================
// 🚀 Initialize Charts
// ========================================
let chartManager;
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        chartManager = new ChartManager();
    }, 1000);
});
