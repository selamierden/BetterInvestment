// API adresi
const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum%2Cripple';

// Kripto para fiyatlarını güncelleme fonksiyonu
function updatePrices() {
  $.getJSON(apiUrl)
    .then(function (data) {
      // BTC fiyatını güncelle
      var btcPrice = data[0].current_price;
      var btcChange = data[0].price_change_percentage_10s;
      $('#btc-price').text('$' + btcPrice.toLocaleString()).css('color', btcChange >= 0 ? 'green' : 'red');

      // ETH fiyatını güncelle
      var ethPrice = data[1].current_price;
      var ethChange = data[1].price_change_percentage_10s;
      $('#eth-price').text('$' + ethPrice.toLocaleString()).css('color', ethChange >= 0 ? 'green' : 'red');

      // XRP fiyatını güncelle
      var xrpPrice = data[2].current_price;
      var xrpChange = data[2].price_change_percentage_10s;
      $('#xrp-price').text('$' + xrpPrice.toLocaleString()).css('color', xrpChange >= 0 ? 'green' : 'red');
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
