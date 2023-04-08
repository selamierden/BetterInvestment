function updateData() {
  // Coingecko API endpoint for top 50 coins
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";

  // Send GET request to Coingecko API
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Clear previous data
      document.getElementById("coin-data").innerHTML = "";

      // Loop through top 50 coins and add data to HTML
      data.forEach((coin, index) => {
        const name = coin.name;
        const symbol = coin.symbol.toUpperCase();
        const image = coin.image;
        const price = coin.current_price.toFixed(2);
        const volume = coin.total_volume.toLocaleString();

        const row = document.createElement("tr");
        row.classList.add("reg");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${symbol}</td>
          <td><img src="${image}" width="25" height="25" alt="${name}"></td>
          <td>$${price}</td>
          <td>$${volume}</td>
        `;
        document.getElementById("coin-data").appendChild(row);
      });
    })
    .catch((error) => console.error(error));
}

// Call updateData() every second
setInterval(updateData, 1000);