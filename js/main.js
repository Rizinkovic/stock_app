// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
        });
    });
    
    // Newsletter form submission
    const newsletterForms = document.querySelectorAll('#newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            alert(`Thank you for subscribing with ${email}! You'll receive our newsletter soon.`);
            form.reset();
        });
    });
});

// Simple line chart drawing function
function drawSimpleLineChart(container, data, positive = true) {
    const canvas = document.createElement('canvas');
    container.innerHTML = '';
    container.appendChild(canvas);
    
    // Set canvas dimensions
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 10;
    
    // Find min and max values for scaling
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const range = maxValue - minValue;
    
    // Calculate scaling factors
    const scaleX = (width - 2 * padding) / (data.length - 1);
    const scaleY = (height - 2 * padding) / range;
    
    // Draw the line
    ctx.beginPath();
    ctx.moveTo(padding, height - padding - (data[0] - minValue) * scaleY);
    
    for (let i = 1; i < data.length; i++) {
        ctx.lineTo(padding + i * scaleX, height - padding - (data[i] - minValue) * scaleY);
    }
    
    ctx.strokeStyle = positive ? '#34C759' : '#FF3B30';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add gradient fill
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    
    for (let i = 0; i < data.length; i++) {
        ctx.lineTo(padding + i * scaleX, height - padding - (data[i] - minValue) * scaleY);
    }
    
    ctx.lineTo(padding + (data.length - 1) * scaleX, height - padding);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, positive ? 'rgba(52, 199, 89, 0.3)' : 'rgba(255, 59, 48, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fill();
}

// Helper function to format numbers
function formatNumber(num, decimals = 2) {
    return num.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// Helper function to format currency
function formatCurrency(num, currency = 'USD') {
    return num.toLocaleString(undefined, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Helper function to get change percentage and class
function getChangeInfo(prev, current) {
    const change = ((current - prev) / prev) * 100;
    return {
        value: Math.abs(change),
        isPositive: change >= 0,
        class: change >= 0 ? 'positive' : 'negative'
    };
}