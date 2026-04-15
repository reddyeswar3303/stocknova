const YahooFinance = require('./node_modules/yahoo-finance2').default;
const yf = new YahooFinance();
yf.quote('^CNXAUTO').then(res => console.log('Found:', res.symbol)).catch(err => console.error('Error: ', err.message));
