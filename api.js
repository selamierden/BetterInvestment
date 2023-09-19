const coins = [
  { id: 'bitcoin', selector: '#btc-price' },
  { id: 'ethereum', selector: '#eth-price' },
  { id: 'ripple', selector: '#xrp-price' },
  { id: 'cardano', selector: '#ada-price' },
  { id: 'dogecoin', selector: '#doge-price' },
  { id: 'solana', selector: '#sol-price' },
  { id: 'binancecoin', selector: '#bnb-price' },
  { id: 'tron', selector: '#tron-price' }
];

async function getApiData() {
  const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum%2Cripple%2Ccardano%2Cdogecoin%2Csolana%2Cbinancecoin%2Ctron&price_change_percentage=24h';
  
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

async function updatePrices() {
  try {
    const data = await getApiData();

    coins.forEach(coin => {
      const coinData = data.find(item => item.id === coin.id);
      const price = coinData.current_price;
      const change = coinData.price_change_percentage_24h;

      document.querySelector(coin.selector).textContent = `$${price.toLocaleString()}`;
      document.querySelector(coin.selector).style.color = change >= 0 ? 'green' : 'red';
    });
  } catch (error) {
    console.log('API request failed', error);
  }
}

document.addEventListener('DOMContentLoaded', updatePrices);

setInterval(updatePrices, 45000);
