const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function test() {
  try {
    const res = await yahooFinance.search('Suzlon');
    console.log('Search Results:', JSON.stringify(res, null, 2));
  } catch (e) {
    console.error(e);
  }
}
test();
