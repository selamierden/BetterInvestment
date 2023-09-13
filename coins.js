function updateData() {
  // Coingecko API endpoint for top 50 coins
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=false&price_change_percentage=24h";

  // Send GET request to Coingecko API
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Clear previous data
      document.getElementById("coin-data").innerHTML = "";

      // Loop through top 50 coins and add data to HTML
      data.forEach((coin) => {
        const name = coin.name;
        const symbol = coin.symbol.toUpperCase();
        const image = coin.image;
        const price = coin.current_price;
        const change = coin.price_change_percentage_24h.toFixed(2);
        const volume = coin.total_volume.toLocaleString();
        const rank = coin.market_cap_rank;

        const row = document.createElement("tr");
        row.classList.add("reg");

        // Determine text color based on change value
        const changeColor = parseFloat(change) >= 0 ? "green" : "red";

        row.innerHTML = `
          <td>${rank}</td>
          <td>${symbol}</td>
          <td><img src="${image}" width="25" height="25" alt="${name}"></td>
          <td>$${price}</td>
          <td style="color: ${changeColor};">${change}%</td>
          <td>$${volume}</td>
        `;
        document.getElementById("coin-data").appendChild(row);
      });
    })
    .catch((error) => console.error(error));
}

setInterval(updateData, 45000);
