const axios = require('axios');

/**
 * Fetches live stock data from Alpha Vantage
 * @param {string[]} symbols - Array of stock symbols (e.g., ['AAPL', 'MSFT'])
 * @returns {Promise<Object[]>} - Array of stock objects
 */
const fetchLivePrices = async (symbols) => {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    throw new Error('ALPHA_VANTAGE_API_KEY is not defined in environment variables');
  }

  const stockPromises = symbols.map(async (symbol) => {
    try {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: apiKey
        }
      });

      const data = response.data['Global Quote'];
      if (!data || Object.keys(data).length === 0) {
        return { symbol, error: 'No data found' };
      }

      return {
        symbol: data['01. symbol'],
        price: parseFloat(data['05. price']),
        change: parseFloat(data['09. change']),
        changePercent: data['10. change percent'],
        volume: data['06. volume'],
        latestTradingDay: data['07. latest trading day']
      };
    } catch (error) {
      return { symbol, error: error.message };
    }
  });

  return Promise.all(stockPromises);
};

module.exports = { fetchLivePrices };
