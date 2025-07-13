document.addEventListener('DOMContentLoaded', function() {
    // Initialize currency converter
    initCurrencyConverter();
    
    // Fetch and display exchange rates
    fetchExchangeRates();
    
    // Draw initial currency chart
    drawCurrencyChart('USD', 'EUR');
});

function initCurrencyConverter() {
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const resultInput = document.getElementById('result');
    const convertBtn = document.getElementById('convert-btn');
    const swapBtn = document.querySelector('.swap-btn');
    
    // Populate currency dropdowns
    const currencies = [
        { code: 'USD', name: 'US Dollar' },
        { code: 'EUR', name: 'Euro' },
        { code: 'GBP', name: 'British Pound' },
        { code: 'JPY', name: 'Japanese Yen' },
        { code: 'CAD', name: 'Canadian Dollar' },
        { code: 'AUD', name: 'Australian Dollar' },
        { code: 'CNY', name: 'Chinese Yuan' },
        { code: 'XAF', name: 'CFA Franc' },
        { code: 'NGN', name: 'Nigerian Naira' },
        { code: 'ZAR', name: 'South African Rand' },
        { code: 'KES', name: 'Kenyan Shilling' },
        { code: 'GHS', name: 'Ghanaian Cedi' }
    ];
    
    currencies.forEach(currency => {
        const option1 = document.createElement('option');
        option1.value = currency.code;
        option1.textContent = `${currency.code} - ${currency.name}`;
        fromCurrencySelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = currency.code;
        option2.textContent = `${currency.code} - ${currency.name}`;
        toCurrencySelect.appendChild(option2);
    });
    
    // Convert currency on button click
    convertBtn.addEventListener('click', function() {
        convertCurrency();
    });
    
    // Convert currency on input change
    amountInput.addEventListener('input', function() {
        convertCurrency();
    });
    
    fromCurrencySelect.addEventListener('change', function() {
        convertCurrency();
        drawCurrencyChart(this.value, toCurrencySelect.value);
    });
    
    toCurrencySelect.addEventListener('change', function() {
        convertCurrency();
        drawCurrencyChart(fromCurrencySelect.value, this.value);
    });
    
    // Swap currencies
    swapBtn.addEventListener('click', function() {
        const temp = fromCurrencySelect.value;
        fromCurrencySelect.value = toCurrencySelect.value;
        toCurrencySelect.value = temp;
        convertCurrency();
        drawCurrencyChart(fromCurrencySelect.value, toCurrencySelect.value);
    });
    
    // Initial conversion
    convertCurrency();
}

function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    
    // In a real app, you would fetch the actual exchange rate from an API
    // For this demo, we'll use mock rates
    const mockRates = {
        USD: { EUR: 0.92, GBP: 0.79, JPY: 149.23, XAF: 605.45, NGN: 770.50 },
        EUR: { USD: 1.09, GBP: 0.86, JPY: 162.34, XAF: 655.78, NGN: 840.23 },
        GBP: { USD: 1.27, EUR: 1.16, JPY: 188.45, XAF: 762.34, NGN: 975.67 },
        JPY: { USD: 0.0067, EUR: 0.0062, GBP: 0.0053, XAF: 4.05, NGN: 5.16 },
        XAF: { USD: 0.00165, EUR: 0.00152, GBP: 0.00131, JPY: 0.247, NGN: 1.27 },
        NGN: { USD: 0.0013, EUR: 0.00119, GBP: 0.00102, JPY: 0.194, XAF: 0.787 }
    };
    
    let rate = 1;
    
    if (fromCurrency === toCurrency) {
        rate = 1;
    } else if (mockRates[fromCurrency] && mockRates[fromCurrency][toCurrency]) {
        rate = mockRates[fromCurrency][toCurrency];
    } else if (mockRates[toCurrency] && mockRates[toCurrency][fromCurrency]) {
        rate = 1 / mockRates[toCurrency][fromCurrency];
    } else {
        // Default to a random rate if not in our mock data
        rate = Math.random() * 2 + 0.5;
    }
    
    const result = amount * rate;
    document.getElementById('result').value = formatNumber(result, 4);
}

function fetchExchangeRates() {
    setTimeout(() => {
        const baseCurrency = 'USD';
        const rates = [
            { currency: 'EUR', rate: 0.92, change: 0.0023 },
            { currency: 'GBP', rate: 0.79, change: -0.0015 },
            { currency: 'JPY', rate: 149.23, change: 0.45 },
            { currency: 'XAF', rate: 605.45, change: 0.05 },
            { currency: 'NGN', rate: 770.50, change: -1.23 },
            { currency: 'CAD', rate: 1.35, change: 0.012 },
            { currency: 'AUD', rate: 1.52, change: -0.023 }
        ];
        
        const container = document.getElementById('rates-table');
        if (!container) return;
        
        const table = document.createElement('table');
        table.className = 'rates-table';
        
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Currency</th>
                <th>Rate</th>
                <th>Change</th>
                <th>Chart</th>
            </tr>
        `;
        table.appendChild(thead);
        
        const tbody = document.createElement('tbody');
        rates.forEach(rate => {
            const changeInfo = getChangeInfo(rate.rate - rate.change, rate.rate);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${baseCurrency}/${rate.currency}</td>
                <td>${formatNumber(rate.rate, 4)}</td>
                <td class="${changeInfo.class}">
                    ${changeInfo.isPositive ? '+' : ''}${formatNumber(rate.change, 4)}
                </td>
                <td><div class="mini-chart"></div></td>
            `;
            tbody.appendChild(row);
            
            // Draw mini chart after row is added
            setTimeout(() => {
                const chartContainer = row.querySelector('.mini-chart');
                if (chartContainer) {
                    const chartData = generateRandomChartData(10, rate.rate, Math.abs(rate.change / rate.rate));
                    drawSimpleLineChart(chartContainer, chartData, changeInfo.isPositive);
                }
            }, 100);
        });
        
        table.appendChild(tbody);
        container.innerHTML = '';
        container.appendChild(table);
    }, 700);
}

function drawCurrencyChart(fromCurrency, toCurrency) {
    const container = document.getElementById('currency-chart');
    if (!container) return;
    
    // In a real app, you would fetch historical data from an API
    // For this demo, we'll generate random data based on the currencies
    const baseValue = fromCurrency === 'USD' ? 
        (toCurrency === 'EUR' ? 0.92 : 
         toCurrency === 'GBP' ? 0.79 : 
         toCurrency === 'JPY' ? 149.23 : 
         toCurrency === 'XAF' ? 605.45 : 
         toCurrency === 'NGN' ? 770.50 : 1) : 1;
    
    const volatility = 0.02; // 2% volatility for the chart
    
    const chartData = [];
    for (let i = 0; i < 30; i++) {
        const randomChange = (Math.random() * 2 - 1) * volatility * baseValue;
        const prevValue = i > 0 ? chartData[i-1] : baseValue;
        chartData.push(prevValue + randomChange);
    }
    
    container.innerHTML = '<canvas></canvas>';
    const canvas = container.querySelector('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 20;
    
    // Find min and max values for scaling
    const minValue = Math.min(...chartData);
    const maxValue = Math.max(...chartData);
    const range = maxValue - minValue;
    
    // Calculate scaling factors
    const scaleX = (width - 2 * padding) / (chartData.length - 1);
    const scaleY = (height - 2 * padding) / range;
    
    // Draw the line
    ctx.beginPath();
    ctx.moveTo(padding, height - padding - (chartData[0] - minValue) * scaleY);
    
    for (let i = 1; i < chartData.length; i++) {
        ctx.lineTo(padding + i * scaleX, height - padding - (chartData[i] - minValue) * scaleY);
    }
    
    ctx.strokeStyle = '#007AFF';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Add gradient fill
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    
    for (let i = 0; i < chartData.length; i++) {
        ctx.lineTo(padding + i * scaleX, height - padding - (chartData[i] - minValue) * scaleY);
    }
    
    ctx.lineTo(padding + (chartData.length - 1) * scaleX, height - padding);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(0, 122, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Add axis labels
    ctx.fillStyle = '#AEAEB2';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';
    ctx.textAlign = 'center';
    
    // X-axis labels (dates)
    for (let i = 0; i < 5; i++) {
        const index = Math.floor(i * (chartData.length - 1) / 4);
        const x = padding + index * scaleX;
        const date = new Date();
        date.setDate(date.getDate() - (chartData.length - 1 - index));
        const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        
        ctx.fillText(dateStr, x, height - 5);
    }
    
    // Y-axis labels (values)
    ctx.textAlign = 'right';
    for (let i = 0; i < 5; i++) {
        const value = minValue + i * range / 4;
        const y = height - padding - i * (height - 2 * padding) / 4;
        
        ctx.fillText(formatNumber(value, 4), padding - 10, y + 4);
    }
    
    // Add title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu';
}

