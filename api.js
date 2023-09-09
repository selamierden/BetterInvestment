// API adresi
const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum%2Cripple%2Ccardano%2Cdogecoin%2Csolana%2Cbinancecoin%2Ctron';

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

function updatePrices() {
  $.getJSON(apiUrl)
    .then(function (data) {
      coins.forEach(function (coin) {
        var coinData = data.find(function (item) { return item.id === coin.id; });
        var price = coinData.current_price;
        var change = coinData.price_change_percentage_10s;
        $(coin.selector).text('$' + price.toLocaleString()).css('color', change >= 0 ? 'green' : 'green');
      });
    })
    .fail(function () {
      console.log('API isteği başarısız oldu');
    });
}

// Sayfa yüklendiğinde fiyatları güncelle
$(document).ready(function () {
  updatePrices();
});

// Fiyatları 10 saniyede bir güncelle
setInterval(updatePrices, 10000);
