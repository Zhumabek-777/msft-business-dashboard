// Microsoft Dashboard Data
const dashboardData = {
    company_info: {
        name: "Microsoft Corporation",
        ticker: "MSFT",
        market_cap: "3.8T"
    },
    business_segments: [
        {
            name: "Productivity and Business Processes",
            key_products: ["Office 365", "Microsoft Teams", "LinkedIn", "Dynamics 365"],
            q4_2025_revenue: 33.1,
            q4_2024_revenue: 28.5,
            growth_rate: 16,
            fy2025_revenue: 130.5,
            fy2024_revenue: 116.5,
            annual_growth: 13,
            key_metrics: {
                office_365_commercial_growth: 15,
                linkedin_revenue_growth: 9,
                dynamics_365_growth: 19,
                microsoft_365_consumer_subscribers: 89.0
            }
        },
        {
            name: "Intelligent Cloud",
            key_products: ["Azure", "SQL Server", "Windows Server", "GitHub"],
            q4_2025_revenue: 29.9,
            q4_2024_revenue: 23.7,
            growth_rate: 26,
            fy2025_revenue: 115.0,
            fy2024_revenue: 96.8,
            annual_growth: 20,
            key_metrics: {
                azure_annual_revenue: 75.0,
                azure_growth_rate: 34,
                azure_quarterly_growth: 39,
                server_products_growth: -5
            }
        },
        {
            name: "More Personal Computing",
            key_products: ["Windows", "Xbox", "Surface", "Bing Search"],
            q4_2025_revenue: 13.5,
            q4_2024_revenue: 12.4,
            growth_rate: 9,
            fy2025_revenue: 58.7,
            fy2024_revenue: 54.7,
            annual_growth: 7,
            key_metrics: {
                gaming_revenue_growth: 50,
                xbox_content_services_growth: 61,
                xbox_hardware_decline: -30,
                windows_oem_growth: 3,
                search_advertising_growth: 21
            }
        }
    ],
    quarterly_performance: {
        q4_2025: {
            total_revenue: 76.4,
            net_income: 27.2,
            operating_income: 34.3,
            earnings_per_share: 3.65
        },
        q4_2024: {
            total_revenue: 64.7,
            net_income: 22.0,
            operating_income: 27.9,
            earnings_per_share: 2.95
        }
    },
    annual_performance: {
        fy2025: {
            total_revenue: 281.7,
            net_income: 101.8,
            operating_income: 128.5,
            earnings_per_share: 13.64
        },
        fy2024: {
            total_revenue: 245.1,
            net_income: 88.1,
            operating_income: 109.4,
            earnings_per_share: 11.86
        }
    }
};

// Global variables for charts
let revenueChart, distributionChart, growthChart;
let currentPeriod = 'quarterly';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Remove focus outline on all clickable elements to fix blue circle issue
    document.addEventListener('click', function(e) {
        if (e.target) {
            e.target.blur();
        }
    });
    
    initializeDashboard();
    setupEventListeners();
    createCharts();
});

function initializeDashboard() {
    updateMetrics();
    updateSegmentData();
}

function setupEventListeners() {
    // Period toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active class from all buttons
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update current period
            currentPeriod = this.dataset.period;
            
            // Update display
            updateMetrics();
            updateSegmentData();
            updateCharts();
            
            // Remove focus to prevent blue circle
            this.blur();
        });
    });

    // Segment card expand/collapse - Fixed event listener setup
    setupExpandButtons();
}

function setupExpandButtons() {
    const expandButtons = document.querySelectorAll('.expand-btn');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Find the parent segment card
            const segmentCard = this.closest('.segment-card');
            const details = segmentCard.querySelector('.segment-details');
            
            if (details) {
                const isHidden = details.classList.contains('hidden');
                
                if (isHidden) {
                    details.classList.remove('hidden');
                    this.textContent = 'Hide Details';
                } else {
                    details.classList.add('hidden');
                    this.textContent = 'View Details';
                }
            }
            
            // Remove focus to prevent blue circle
            this.blur();
        });
    });
}

function updateMetrics() {
    const isQuarterly = currentPeriod === 'quarterly';
    const current = isQuarterly ? dashboardData.quarterly_performance.q4_2025 : dashboardData.annual_performance.fy2025;
    const previous = isQuarterly ? dashboardData.quarterly_performance.q4_2024 : dashboardData.annual_performance.fy2024;

    // Calculate percentage changes
    const revenueChange = ((current.total_revenue - previous.total_revenue) / previous.total_revenue * 100).toFixed(0);
    const incomeChange = ((current.net_income - previous.net_income) / previous.net_income * 100).toFixed(0);
    const operatingChange = ((current.operating_income - previous.operating_income) / previous.operating_income * 100).toFixed(0);
    const epsChange = ((current.earnings_per_share - previous.earnings_per_share) / previous.earnings_per_share * 100).toFixed(0);

    // Update DOM elements
    const revenueElement = document.getElementById('total-revenue');
    const incomeElement = document.getElementById('net-income');
    const operatingElement = document.getElementById('operating-income');
    const epsElement = document.getElementById('eps');

    if (revenueElement) revenueElement.textContent = `$${current.total_revenue}B`;
    if (incomeElement) incomeElement.textContent = `$${current.net_income}B`;
    if (operatingElement) operatingElement.textContent = `$${current.operating_income}B`;
    if (epsElement) epsElement.textContent = `$${current.earnings_per_share}`;

    // Update change indicators
    const revenueChangeElement = document.getElementById('revenue-change');
    const incomeChangeElement = document.getElementById('income-change');
    const operatingChangeElement = document.getElementById('operating-change');
    const epsChangeElement = document.getElementById('eps-change');

    if (revenueChangeElement) revenueChangeElement.textContent = `+${revenueChange}%`;
    if (incomeChangeElement) incomeChangeElement.textContent = `+${incomeChange}%`;
    if (operatingChangeElement) operatingChangeElement.textContent = `+${operatingChange}%`;
    if (epsChangeElement) epsChangeElement.textContent = `+${epsChange}%`;
}

function updateSegmentData() {
    const isQuarterly = currentPeriod === 'quarterly';
    
    dashboardData.business_segments.forEach((segment, index) => {
        const revenue = isQuarterly ? segment.q4_2025_revenue : segment.fy2025_revenue;
        const growth = isQuarterly ? segment.growth_rate : segment.annual_growth;
        
        const segmentIds = ['productivity', 'cloud', 'computing'];
        const segmentId = segmentIds[index];
        
        const revenueElement = document.getElementById(`${segmentId}-revenue`);
        const growthElement = document.getElementById(`${segmentId}-growth`);
        
        if (revenueElement) revenueElement.textContent = `$${revenue}B`;
        if (growthElement) growthElement.textContent = `+${growth}%`;
    });
}

function createCharts() {
    createRevenueChart();
    createDistributionChart();
    createGrowthChart();
}

function createRevenueChart() {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const isQuarterly = currentPeriod === 'quarterly';
    
    const currentData = dashboardData.business_segments.map(segment => 
        isQuarterly ? segment.q4_2025_revenue : segment.fy2025_revenue
    );
    const previousData = dashboardData.business_segments.map(segment => 
        isQuarterly ? segment.q4_2024_revenue : segment.fy2024_revenue
    );
    const labels = ['Productivity & Business', 'Intelligent Cloud', 'More Personal Computing'];

    revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: isQuarterly ? 'Q4 2025' : 'FY 2025',
                data: currentData,
                backgroundColor: '#1FB8CD',
                borderColor: '#1FB8CD',
                borderWidth: 1
            }, {
                label: isQuarterly ? 'Q4 2024' : 'FY 2024',
                data: previousData,
                backgroundColor: '#FFC185',
                borderColor: '#FFC185',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Revenue (Billions USD)'
                    }
                }
            }
        }
    });
}

function createDistributionChart() {
    const canvas = document.getElementById('distributionChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const isQuarterly = currentPeriod === 'quarterly';
    
    const data = dashboardData.business_segments.map(segment => 
        isQuarterly ? segment.q4_2025_revenue : segment.fy2025_revenue
    );
    const labels = ['Productivity & Business', 'Intelligent Cloud', 'More Personal Computing'];

    distributionChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                borderColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

function createGrowthChart() {
    const canvas = document.getElementById('growthChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const isQuarterly = currentPeriod === 'quarterly';
    
    const data = dashboardData.business_segments.map(segment => 
        isQuarterly ? segment.growth_rate : segment.annual_growth
    );
    const labels = ['Productivity & Business', 'Intelligent Cloud', 'More Personal Computing'];

    growthChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Growth Rate (%)',
                data: data,
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                borderColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Growth Rate (%)'
                    }
                }
            }
        }
    });
}

function updateCharts() {
    // Destroy existing charts
    if (revenueChart) {
        revenueChart.destroy();
        revenueChart = null;
    }
    if (distributionChart) {
        distributionChart.destroy();
        distributionChart = null;
    }
    if (growthChart) {
        growthChart.destroy();
        growthChart = null;
    }
    
    // Recreate charts with new data
    setTimeout(() => {
        createCharts();
    }, 100);
}

// Utility function to format numbers
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'B';
    } else {
        return num.toFixed(1) + 'M';
    }
}

// Add smooth scrolling for better UX
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Add loading states for better UX
function showLoading(element) {
    if (element) {
        element.style.opacity = '0.5';
        element.style.pointerEvents = 'none';
    }
}

function hideLoading(element) {
    if (element) {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
    }
}