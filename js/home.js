document.addEventListener('DOMContentLoaded', function () {
    // Replace with your API keys
    const EODHD_API_KEY = ' 684ac32a478207.04143584'; // Sign up at https://eodhd.com/
    const ALPHA_VANTAGE_API_KEY = ''; // For currencies
    const NEWS_API_KEY = 'dacce8a315cd4170bae6673584d02f3f'; // Sign up at https://newsapi.org/
    const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'; // No key needed

    // Fetch data
    fetchStockIndices();
    fetchCryptoPrices();
    fetchCurrencyRates();
    fetchStockNews();
    fetchCryptoNews();
    generatePredictions();

    // Fetch stock indices from EODHD
    async function fetchStockIndices() {
        const symbols = [
            { symbol: '^GSPC.INDX', name: 'S&P 500' }, // EODHD uses ^GSPC.INDX
            { symbol: '^IXIC.INDX', name: 'NASDAQ' }, // NASDAQ Composite
            { symbol: '^DJI.INDX', name: 'Dow Jones' }, // Dow Jones Industrial Average
            { symbol: '^FTSE.INDX', name: 'FTSE 100' }, // FTSE 100
            { symbol: '^FCHI.INDX', name: 'CAC 40' }, // CAC 40
        ];
        const container = document.getElementById('stock-indices');
        if (!container) {
            console.error('Stock indices container not found');
            return;
        }

        container.innerHTML = '<div>Loading...</div>';

        try {
            // Batch request for all symbols in one call
            const symbolList = symbols.map(s => s.symbol).join(',');
            const url = `https://eodhd.com/api/real-time/${symbolList}?api_token=${EODHD_API_KEY}&fmt=json`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            const indices = [];
            for (const { symbol, name } of symbols) {
                const quote = Array.isArray(data) ? data.find(d => d.code === symbol) : data;
                if (!quote || !quote.close) throw new Error(`No data for ${symbol}`);

                const price = parseFloat(quote.close);
                const previousClose = parseFloat(quote.previousClose);
                const change = price - previousClose;
                const changePercent = ((change / previousClose) * 100).toFixed(2);

                indices.push({ symbol, name, price, change, changePercent: parseFloat(changePercent) });
            }

            container.innerHTML = '';
            indices.forEach((index) => {
                const changeInfo = getChangeInfo(index.price - index.change, index.price);
                const item = document.createElement('div');
                item.className = 'summary-item';
                item.innerHTML = `
                    <div class="name">${index.name}</div>
                    <div class="value">${formatNumber(index.price)}</div>
                    <div class="change ${changeInfo.class}">
                        ${changeInfo.isPositive ? '+' : ''}${formatNumber(index.changePercent)}%
                    </div>
                `;
                container.appendChild(item);
            });
        } catch (error) {
            console.error('Error fetching stock indices:', error);
            container.innerHTML = '<div>Error loading data: ' + error.message + '</div>';
        }
    }

    // Fetch crypto prices from CoinGecko (unchanged)
    async function fetchCryptoPrices() {
        const coins = ['bitcoin', 'ethereum', 'binancecoin', 'solana'];
        const container = document.getElementById('crypto-prices');
        if (!container) {
            console.error('Crypto prices container not found');
            return;
        }

        container.innerHTML = '<div>Loading...</div>';

        try {
            const url = `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&ids=${coins.join(',')}&order=market_cap_desc&per_page=4&page=1&sparkline=false&price_change_percentage=24h`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            const cryptos = data.map((coin) => ({
                symbol: coin.symbol.toUpperCase(),
                name: coin.name,
                price: coin.current_price,
                changePercent: coin.price_change_percentage_24h,
            }));

            container.innerHTML = '';
            cryptos.forEach((crypto) => {
                const changeInfo = getChangeInfo(crypto.price / (1 + crypto.changePercent / 100), crypto.price);
                const item = document.createElement('div');
                item.className = 'summary-item';
                item.innerHTML = `
                    <div class="name">${crypto.name}</div>
                    <div class="value">${formatCurrency(crypto.price)}</div>
                    <div class="change ${changeInfo.class}">
                        ${changeInfo.isPositive ? '+' : ''}${formatNumber(crypto.changePercent)}%
                    </div>
                `;
                container.appendChild(item);
            });
        } catch (error) {
            console.error('Error fetching crypto prices:', error);
            container.innerHTML = '<div>Error loading data</div>';
        }
    }

    // Fetch currency rates from Alpha Vantage (unchanged)
    async function fetchCurrencyRates() {
        const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/XAF'];
        const container = document.getElementById('currency-rates');
        if (!container) {
            console.error('Currency rates container not found');
            return;
        }

        container.innerHTML = '<div>Loading...</div>';

        try {
            const rates = [];
            for (const pair of pairs) {
                const [from, to] = pair.split('/');
                const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${ALPHA_VANTAGE_API_KEY}`;
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                const rateData = data['Realtime Currency Exchange Rate'];
                if (!rateData) throw new Error(`No data for ${pair}`);

                const rate = parseFloat(rateData['5. Exchange Rate']);
                const previousRate = rate / (1 + (Math.random() - 0.5) * 0.01); // Simulated previous rate
                const changePercent = ((rate - previousRate) / previousRate * 100).toFixed(2);

                rates.push({ pair, rate, changePercent: parseFloat(changePercent) });
                await new Promise(resolve => setTimeout(resolve, 12000)); // 12s delay for rate limit
            }

            container.innerHTML = '';
            rates.forEach((rate) => {
                const changeInfo = getChangeInfo(rate.rate / (1 + rate.changePercent / 100), rate.rate);
                const item = document.createElement('div');
                item.className = 'summary-item';
                item.innerHTML = `
                    <div class="name">${rate.pair}</div>
                    <div class="value">${formatNumber(rate.rate, 4)}</div>
                    <div class="change ${changeInfo.class}">
                        ${changeInfo.isPositive ? '+' : ''}${formatNumber(rate.changePercent)}%
                    </div>
                `;
                container.appendChild(item);
            });
        } catch (error) {
            console.error('Error fetching currency rates:', error);
            container.innerHTML = '<div>Error loading data</div>';
        }
    }

    // Fetch stock news from NewsAPI (unchanged)
    async function fetchStockNews() {
        const container = document.getElementById('stock-news');
        if (!container) {
            console.error('Stock news container not found');
            return;
        }

        container.innerHTML = '<div>Loading...</div>';

        try {
            const url = `https://newsapi.org/v2/everything?q=stock%20market&language=en&sortBy=publishedAt&apiKey=${NEWS_API_KEY}&pageSize=3`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            const articles = data.articles;

            const news = articles.map((article) => ({
                title: article.title,
                source: article.source.name,
                date: new Date(article.publishedAt).toLocaleString(),
                image: article.urlToImage || 'https://via.placeholder.com/500x300?text=News+Image',
            }));

            container.innerHTML = '';
            news.forEach((item) => {
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';
                newsItem.innerHTML = `
                    <div class="news-image" style="background-image: url('${item.image}')"></div>
                    <div class="news-content">
                        <h4 class="news-title">${item.title}</h4>
                        <div class="news-source">${item.source}</div>
                        <div class="news-date">${item.date}</div>
                    </div>
                `;
                container.appendChild(newsItem);
            });
        } catch (error) {
            console.error('Error fetching stock news:', error);
            container.innerHTML = '<div>Error loading data</div>';
        }
    }

    // Fetch crypto news from NewsAPI (unchanged)
    async function fetchCryptoNews() {
        const container = document.getElementById('crypto-news');
        if (!container) {
            console.error('Crypto news container not found');
            return;
        }

        container.innerHTML = '<div>Loading...</div>';

        try {
            const url = `https://newsapi.org/v2/everything?q=cryptocurrency&language=en&sortBy=publishedAt&apiKey=${NEWS_API_KEY}&pageSize=3`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            const articles = data.articles;

            const news = articles.map((article) => ({
                title: article.title,
                source: article.source.name,
                date: new Date(article.publishedAt).toLocaleString(),
                image: article.urlToImage || 'https://via.placeholder.com/500x300?text=News+Image',
            }));

            container.innerHTML = '';
            news.forEach((item) => {
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';
                item.innerHTML = `
                    <div class="news-image" style="background-image: url('${item.image}')"></div>
                    <div class="news-content">
                        <h4 class="news-title">${item.title}</h4>
                        <div class="news-source">${item.source}</div>
                        <div class="news-date">${item.date}</div>
                    </div>
                `;
                container.appendChild(newsItem);
            });
        } catch (error) {
            console.error('Error fetching crypto news:', error);
            container.innerHTML = '<div>Error loading data</div>';
        }
    }

    // Mock predictions (unchanged)
    function generatePredictions() {
        setTimeout(() => {
            const predictions = [
                {
                    asset: 'S&P 500',
                    prediction: 'Moderate growth expected in Q1 2024 with potential 5-7% increase',
                    confidence: 'High',
                },
                {
                    asset: 'Bitcoin',
                    prediction: 'Possible rally to $50,000 if ETF approvals materialize',
                    confidence: 'Medium',
                },
                {
                    asset: 'EUR/USD',
                    prediction: 'Likely to remain range-bound between 1.07 and 1.10',
                    confidence: 'High',
                },
            ];

            const container = document.getElementById('market-predictions');
            if (!container) {
                console.error('Market predictions container not found');
                return;
            }

            container.innerHTML = '';

            predictions.forEach((item) => {
                const predictionItem = document.createElement('div');
                predictionItem.className = 'card';
                predictionItem.innerHTML = `
                    <h3>${item.asset}</h3>
                    <p>${item.prediction}</p>
                    <div class="confidence">Confidence: <span>${item.confidence}</span></div>
                `;
                container.appendChild(predictionItem);
            });
        }, 1500);
    }

    // Utility functions (unchanged)
    function getChangeInfo(previous, current) {
        const isPositive = current >= previous;
        return {
            isPositive,
            class: isPositive ? 'positive' : 'negative',
        };
    }

    function formatNumber(number, decimals = 2) {
        return number.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function formatCurrency(number) {
        return `$${formatNumber(number, 2)}`;
    }
});