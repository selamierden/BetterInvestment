async function submitForm(){

  var coin = document.getElementById("coin").value;
  var miktar = document.getElementById("miktar").value;
  var firstprice = document.getElementById("firstprice").value;
  
  // Retrieve the current price of the coin from Coingecko API
  var apiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=" + coin + "&vs_currencies=usd";
  var response = await fetch(apiUrl);
  var data = await response.json();
  var currentPrice = data[coin.toLowerCase()].usd;

  // Calculate the profit and profit rate
  var profit = (currentPrice / firstprice) * miktar - miktar;
  var profitRate = (profit / miktar) * 100;
  
  var spot = {
    coin:coin,
    miktar:miktar,
    firstprice:firstprice,
    currentPrice:currentPrice,
    profit:profit,
    profitRate:profitRate,
  };
  
  if(localStorage.getItem("spots") === null){
    localStorage.setItem("spots", "[]");
  }
  
  var spots = JSON.parse(localStorage.getItem("spots"));
  spots.push(spot);
  localStorage.setItem("spots",JSON.stringify(spots));
  
  var table = document.getElementById("table");
  var row = table.insertRow(-1);
  
  var coinCell = row.insertCell(0);
  var miktarCell = row.insertCell(1);
  var firstpriceCell = row.insertCell(2);
  var currentpriceCell = row.insertCell(3);
  var profitCell = row.insertCell(4);
  var profitRateCell = row.insertCell(5);
  var actionCell = row.insertCell(6);
  
  coinCell.innerHTML = coin;
  miktarCell.innerHTML = miktar;
  firstpriceCell.innerHTML = firstprice;
  currentpriceCell.innerHTML = currentPrice;
  profitCell.innerHTML = profit.toFixed(2);
  profitRateCell.innerHTML = profitRate.toFixed(2) + "%";

  // Add refresh button to current price cell
  var refreshBtn = document.createElement("button");
  refreshBtn.classList.add("btn", "btn-outline-primary", "mx-2");
  refreshBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Yenile';
  refreshBtn.onclick = async function() {
    // Retrieve updated current price from API
    var updatedResponse = await fetch(apiUrl);
    var updatedData = await updatedResponse.json();
    var updatedCurrentPrice = updatedData[coin.toLowerCase()].usd;
    currentpriceCell.innerHTML = updatedCurrentPrice;
    // Recalculate profit and profit rate using updated current price
    var updatedProfit = (updatedCurrentPrice / firstprice) * miktar - miktar;
    var updatedProfitRate = (updatedProfit / miktar) * 100;
    profitCell.innerHTML = updatedProfit.toFixed(2);
    profitRateCell.innerHTML = updatedProfitRate.toFixed(2) + "%";
  };
  currentpriceCell.appendChild(refreshBtn);

  actionCell.innerHTML = '<button onclick="deleteRow(this)" class="btn btn-outline-danger"><i class="bi bi-trash"></i> Sil</button>';
  
};



function deleteRow(button) {
  // Get the row that the button is in
  var row = button.parentNode.parentNode;
  
  // Get the spot data from the row cells
  var coin = row.cells[0].innerHTML;
  var miktar = row.cells[1].innerHTML;
  var firstprice = row.cells[2].innerHTML;
  
  // Remove the row from the table
  row.parentNode.removeChild(row);
  
  // Remove the spot data from localStorage
  var spots = JSON.parse(localStorage.getItem("spots"));
  var index = -1;
  for (var i = 0; i < spots.length; i++) {
  if (spots[i].coin === coin && spots[i].miktar === miktar && spots[i].firstprice === firstprice) {
  index = i;
  break;
  }
  }
  if (index > -1) {
  spots.splice(index, 1);
  localStorage.setItem("spots", JSON.stringify(spots));
  }
};

function clearTable() {
  var table = document.getElementById("table");

  while(table.rows.length > 1) {
    table.deleteRow(-1);
  }

  localStorage.removeItem("spots");
};


window.onload = function() {
  // Get the spots data from localStorage and populate the table
  var spots = JSON.parse(localStorage.getItem("spots"));
  if (spots !== null) {
    var table = document.getElementById("table");
    for (var i = 0; i < spots.length; i++) {
      var row = table.insertRow(-1);
      var coinCell = row.insertCell(0);
      var miktarCell = row.insertCell(1);
      var firstpriceCell = row.insertCell(2);
      var actionCell = row.insertCell(3);
      coinCell.innerHTML = spots[i].coin;
      miktarCell.innerHTML = spots[i].miktar;
      firstpriceCell.innerHTML = spots[i].firstprice;
      
      actionCell.innerHTML = '<button onclick="deleteRow(this)" class="btn btn-outline-danger"><i class="bi bi-trash"></i>Sil</button>';
    }
  }
  
  // Get the latest prices from Coingecko and update the table
  var rows = document.querySelectorAll('#table tr:not(:first-child)');
  for (var i = 0; i < rows.length; i++) {
    var coin = rows[i].cells[0].innerHTML;
    var miktar = rows[i].cells[1].innerHTML;
    var firstprice = rows[i].cells[2].innerHTML;
    var currentPriceCell = rows[i].insertCell(3);
    var profitCell = rows[i].insertCell(4);
    var profitRateCell = rows[i].insertCell(5);
    
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=' + coin.toLowerCase() + '&vs_currencies=usd')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var currentPrice = data[coin.toLowerCase()].usd;
      var profit = (currentPrice / firstprice) * miktar - miktar;
      var profitRate = (profit / miktar) * 100;
      currentPriceCell.innerHTML = currentPrice;
      profitCell.innerHTML = profit.toFixed(2);
      profitRateCell.innerHTML = profitRate.toFixed(2) + "%";
    })
    .catch(function(error) {
      console.log(error);
    });
  }
};
