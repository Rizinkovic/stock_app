document.addEventListener('DOMContentLoaded', function() {
    fetchTopCryptos();
    
    // See more crypto button
    const seeMoreBtn = document.getElementById('see-more-crypto');
    if (seeMoreBtn) {
        seeMoreBtn.addEventListener('click', function() {
            fetchAdditionalCryptos();
            this.style.display = 'none';
        });
    }
});

function fetchTopCryptos() {
    setTimeout(() => {
        const cryptos = [
            { symbol: 'BTC', name: 'Bitcoin', price: 42000.45, changePercent: 1.23, volume: 28.5 },
            { symbol: 'ETH', name: 'Ethereum', price: 2800.12, changePercent: -0.45, volume: 15.2 },
            { symbol: 'BNB', name: 'Binance Coin', price: 350.67, changePercent: 2.34, volume: 5.7 },
            { symbol: 'XRP', name: 'Ripple', price: 0.62, changePercent: 0.78, volume: 3.2 },
            { symbol: 'SOL', name: 'Solana', price: 150.89, changePercent: 5.67, volume: 4.8 }
        ];
        
        const container = document.getElementById('top-cryptos');
        if (!container) return;
        
        container.innerHTML = '';
        
        cryptos.forEach(crypto => {
            const changeInfo = getChangeInfo(crypto.price / (1 + crypto.changePercent / 100), crypto.price);
            const chartData = generateRandomChartData(20, crypto.price, crypto.changePercent / 100);
            
            const card = document.createElement('div');
            card.className = 'crypto-card card';
            card.innerHTML = `
                <div class="crypto-header">
                    <div>
                        <div class="crypto-name">${crypto.name}</div>
                        <div class="crypto-symbol">${crypto.symbol}</div>
                    </div>
                    <div>
                        <div class="crypto-price">${formatCurrency(crypto.price)}</div>
                        <div class="crypto-change ${changeInfo.class}">
                            ${changeInfo.isPositive ? '+' : ''}${formatNumber(crypto.changePercent)}%
                        </div>
                    </div>
                </div>
                <div class="crypto-volume">
                    <span>24h Vol:</span> $${formatNumber(crypto.volume)}B
                </div>
                <div class="crypto-chart"></div>
            `;
            
            container.appendChild(card);
            
            // Draw chart after the element is added to DOM
            setTimeout(() => {
                const chartContainer = card.querySelector('.crypto-chart');
                if (chartContainer) {
                    drawSimpleLineChart(chartContainer, chartData, changeInfo.isPositive);
                }
            }, 100);
        });
    }, 600);
}

function fetchAdditionalCryptos() {
    setTimeout(() => {
        const additionalCryptos = [
            { symbol: 'ADA', name: 'Cardano', price: 0.45, changePercent: 1.23, volume: 1.2 },
            { symbol: 'DOGE', name: 'Dogecoin', price: 0.12, changePercent: -2.45, volume: 0.8 },
            { symbol: 'DOT', name: 'Polkadot', price: 6.78, changePercent: 3.45, volume: 1.5 },
            { symbol: 'AVAX', name: 'Avalanche', price: 32.45, changePercent: 0.78, volume: 2.1 },
            { symbol: 'LTC', name: 'Litecoin', price: 78.90, changePercent: -1.23, volume: 1.8 }
        ];
        
        const container = document.getElementById('top-cryptos');
        if (!container) return;
        
        additionalCryptos.forEach(crypto => {
            const changeInfo = getChangeInfo(crypto.price / (1 + crypto.changePercent / 100), crypto.price);
            const chartData = generateRandomChartData(20, crypto.price, crypto.changePercent / 100);
            
            const card = document.createElement('div');
            card.className = 'crypto-card card';
            card.innerHTML = `
                <div class="crypto-header">
                    <div>
                        <div class="crypto-name">${crypto.name}</div>
                        <div class="crypto-symbol">${crypto.symbol}</div>
                    </div>
                    <div>
                        <div class="crypto-price">${formatCurrency(crypto.price)}</div>
                        <div class="crypto-change ${changeInfo.class}">
                            ${changeInfo.isPositive ? '+' : ''}${formatNumber(crypto.changePercent)}%
                        </div>
                    </div>
                </div>
                <div class="crypto-volume">
                    <span>24h Vol:</span> $${formatNumber(crypto.volume)}B
                </div>
                <div class="crypto-chart"></div>
            `;
            
            container.appendChild(card);
            
            // Draw chart after the element is added to DOM
            setTimeout(() => {
                const chartContainer = card.querySelector('.crypto-chart');
                if (chartContainer) {
                    drawSimpleLineChart(chartContainer, chartData, changeInfo.isPositive);
                }
            }, 100);
        });
    }, 500);
}