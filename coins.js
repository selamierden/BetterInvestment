const coinsService = {
  async getCoins(){
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=false&price_change_percentage=24h";

    const response = await fetch(url);
    const data = await response.json();

    return data;
  }
};

const tableService = {
  updateCoinData(coins) {
    const coinDataTable = document.getElementById("coin-data");
    coinDataTable.innerHTML = "";

    coins.forEach((coin) => {
      const name = coin.name;
      const symbol = coin.symbol.toUpperCase();
      const image = coin.image;
      const price = coin.current_price;
      const change = coin.price_change_percentage_24h.toFixed(2);
      const volume = coin.total_volume.toLocaleString();
      const rank = coin.market_cap_rank;

      const row = document.createElement("tr");
      row.classList.add("reg");

      const changeColor = parseFloat(change) >= 0 ? "green" : "red";

      row.innerHTML =
       `
        <td>${rank}</td>
        <td>${symbol}</td>
        <td><img src="${image}" width="25" height="25" alt="${name}"></td>
        <td>$${price}</td>
        <td style="color: ${changeColor};">${change}%</td>
        <td>$${volume}</td>
       `;

       coinDataTable.appendChild(row);
    });
  }
};

const uiController = {
  async updateData() {
    const coins = await coinsService.getCoins();
    tableService.updateCoinData(coins);
  }
};

setInterval(uiController.updateData, 1000);