import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();
yahooFinance.quote('^CNXAUTO').then(res => console.log('Found:', res.symbol)).catch(err => console.error('Error: ', err.message));
