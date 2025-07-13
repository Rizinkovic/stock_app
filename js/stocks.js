document.addEventListener('DOMContentLoaded', function() {
    fetchMajorIndices();
    fetchTrendingStocks();
    
    // See more stocks button
    const seeMoreBtn = document.getElementById('see-more-stocks');
    if (seeMoreBtn) {
        seeMoreBtn.addEventListener('click', function() {
            fetchAdditionalStocks();
            this.style.display = 'none';
        });
    }
});

function fetchMajorIndices() {
    setTimeout(() => {
        const indices = [
            { symbol: '^GSPC', name: 'S&P 500', price: 4378.38, change: 15.23, changePercent: 0.35 },
            { symbol: '^IXIC', name: 'NASDAQ', price: 14578.54, change: -32.45, changePercent: -0.22 },
            { symbol: '^DJI', name: 'Dow Jones', price: 34299.12, change: 45.67, changePercent: 0.13 },
            { symbol: '^FTSE', name: 'FTSE 100', price: 7123.27, change: -12.34, changePercent: -0.17 },
            { symbol: '^FCHI', name: 'CAC 40', price: 6565.78, change: 23.45, changePercent: 0.36 }
        ];
        
        const container = document.getElementById('major-indices');
        if (!container) return;
        
        container.innerHTML = '';
        
        indices.forEach(index => {
            const changeInfo = getChangeInfo(index.price - index.change, index.price);
            const chartData = generateRandomChartData(20, index.price, index.changePercent / 100);
            
            const card = document.createElement('div');
            card.className = 'index-card card';
            card.innerHTML = `
                <div class="index-header">
                    <div>
                        <div class="index-name">${index.name}</div>
                        <div class="index-symbol">${index.symbol}</div>
                    </div>
                    <div>
                        <div class="index-price">${formatNumber(index.price)}</div>
                        <div class="index-change ${changeInfo.class}">
                            ${changeInfo.isPositive ? '+' : ''}${formatNumber(index.change)} (${changeInfo.isPositive ? '+' : ''}${formatNumber(index.changePercent)}%)
                        </div>
                    </div>
                </div>
                <div class="index-chart"></div>
            `;
            
            container.appendChild(card);
            
            // Draw chart after the element is added to DOM
            setTimeout(() => {
                const chartContainer = card.querySelector('.index-chart');
                if (chartContainer) {
                    drawSimpleLineChart(chartContainer, chartData, changeInfo.isPositive);
                }
            }, 100);
        });
    }, 500);
}

function fetchTrendingStocks() {
    setTimeout(() => {
        const stocks = [
            { symbol: 'AAPL', name: 'Apple Inc.', price: 193.58, changePercent: 0.45 },
            { symbol: 'MSFT', name: 'Microsoft Corp.', price: 374.51, changePercent: -0.23 },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, changePercent: 1.12 },
            { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 154.07, changePercent: 0.78 },
            { symbol: 'META', name: 'Meta Platforms', price: 352.71, changePercent: -0.45 }
        ];
        
        const container = document.getElementById('trending-stocks');
        if (!container) return;
        
        container.innerHTML = '';
        
        stocks.forEach(stock => {
            const changeInfo = getChangeInfo(stock.price / (1 + stock.changePercent / 100), stock.price);
            const chartData = generateRandomChartData(20, stock.price, stock.changePercent / 100);
            
            const card = document.createElement('div');
            card.className = 'stock-card card';
            card.innerHTML = `
                <div class="stock-header">
                    <div>
                        <div class="stock-name">${stock.name}</div>
                        <div class="stock-symbol">${stock.symbol}</div>
                    </div>
                    <div>
                        <div class="stock-price">${formatCurrency(stock.price)}</div>
                        <div class="stock-change ${changeInfo.class}">
                            ${changeInfo.isPositive ? '+' : ''}${formatNumber(stock.changePercent)}%
                        </div>
                    </div>
                </div>
                <div class="stock-chart"></div>
            `;
            
            container.appendChild(card);
            
            // Draw chart after the element is added to DOM
            setTimeout(() => {
                const chartContainer = card.querySelector('.stock-chart');
                if (chartContainer) {
                    drawSimpleLineChart(chartContainer, chartData, changeInfo.isPositive);
                }
            }, 100);
        });
    }, 800);
}

function fetchAdditionalStocks() {
    setTimeout(() => {
        const additionalStocks = [
            { symbol: 'TSLA', name: 'Tesla Inc.', price: 240.45, changePercent: 2.34 },
            { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 495.22, changePercent: 3.45 },
            { symbol: 'JPM', name: 'JPMorgan Chase', price: 172.34, changePercent: -0.56 },
            { symbol: 'V', name: 'Visa Inc.', price: 259.12, changePercent: 0.78 },
            { symbol: 'WMT', name: 'Walmart Inc.', price: 163.45, changePercent: -0.23 }
        ];
        
        const container = document.getElementById('trending-stocks');
        if (!container) return;
        
        additionalStocks.forEach(stock => {
            const changeInfo = getChangeInfo(stock.price / (1 + stock.changePercent / 100), stock.price);
            const chartData = generateRandomChartData(20, stock.price, stock.changePercent / 100);
            
            const card = document.createElement('div');
            card.className = 'stock-card card';
            card.innerHTML = `
                <div class="stock-header">
                    <div>
                        <div class="stock-name">${stock.name}</div>
                        <div class="stock-symbol">${stock.symbol}</div>
                    </div>
                    <div>
                        <div class="stock-price">${formatCurrency(stock.price)}</div>
                        <div class="stock-change ${changeInfo.class}">
                            ${changeInfo.isPositive ? '+' : ''}${formatNumber(stock.changePercent)}%
                        </div>
                    </div>
                </div>
                <div class="stock-chart"></div>
            `;
            
            container.appendChild(card);
            
            // Draw chart after the element is added to DOM
            setTimeout(() => {
                const chartContainer = card.querySelector('.stock-chart');
                if (chartContainer) {
                    drawSimpleLineChart(chartContainer, chartData, changeInfo.isPositive);
                }
            }, 100);
        });
    }, 500);
}

function generateRandomChartData(count, baseValue, volatility) {
    const data = [baseValue];
    for (let i = 1; i < count; i++) {
        const randomChange = (Math.random() * 2 - 1) * volatility * baseValue;
        data.push(data[i-1] + randomChange);
    }
    return data;
}