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
  var refreshCell = row.insertCell(7);
  var finishCell = row.insertCell(8);

  
  coinCell.innerHTML = coin;
  miktarCell.innerHTML = miktar;
  firstpriceCell.innerHTML = firstprice;
  currentpriceCell.innerHTML = currentPrice;
  profitCell.innerHTML = profit.toFixed(2);
  profitRateCell.innerHTML = profitRate.toFixed(2) + "%";

  if (profitRate > 0) {
    profitRateCell.style.color = "green";
  } else if (profitRate < 0) {
    profitRateCell.style.color = "red";
  }

  if (profit > 0) {
    profitCell.style.color = "green";
  } else if (profitRate < 0) {
    profitCell.style.color = "red";
  }

  actionCell.innerHTML = '<button onclick="deleteRow(this)" class="btn btn-outline-danger"><i class="fas fa-trash-alt"></i></button>';
  refreshCell.innerHTML = '<button onclick="refreshRow(this)" id="rbtn" class="btn btn-outline-primary"><i class="fas fa-sync-alt"></i></button>';
  finishCell.innerHTML = '<button onclick="finishRow(this)" class="btn btn-success">Sold<i class="fas fa-check"></i></button>';

  updateBalance();
};

// Define a function to update the current price for a row
async function refreshRow(button) {
  // Get the row containing the clicked button
  var row = button.parentNode.parentNode;

  // Retrieve the current price of the coin from Coingecko API
  var coin = row.cells[0].innerHTML;
  var apiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=" + coin + "&vs_currencies=usd";
  var response = await fetch(apiUrl);
  var data = await response.json();
  var currentPrice = data[coin.toLowerCase()].usd;

  // Update the current price cell in the row
  var currentpriceCell = row.cells[3];
  currentpriceCell.innerHTML = currentPrice;

  // Recalculate the profit and profit rate for the row
  var miktar = parseFloat(row.cells[1].innerHTML);
  var firstprice = parseFloat(row.cells[2].innerHTML);
  var profit = (currentPrice / firstprice) * miktar - miktar;
  var profitRate = (profit / miktar) * 100;
  var profitCell = row.cells[4];
  var profitRateCell = row.cells[5];
  profitCell.innerHTML = profit.toFixed(2);
  profitRateCell.innerHTML = profitRate.toFixed(2) + "%";

  if (profitRate > 0) {
    profitRateCell.style.color = "green";
  } else if (profitRate < 0) {
    profitRateCell.style.color = "red";
  }

  if (profit > 0) {
    profitCell.style.color = "green";
  } else if (profit < 0) {
    profitCell.style.color = "red";
  }

  // Update the corresponding spot in localStorage
  var spots = JSON.parse(localStorage.getItem("spots"));
  var spotIndex = -1;
  for (var i = 0; i < spots.length; i++) {
    if (
      spots[i].coin === coin &&
      parseFloat(spots[i].miktar) === miktar &&
      parseFloat(spots[i].firstprice) === firstprice
    ) {
      spotIndex = i;
      break;
    }
  }

  if (spotIndex !== -1) {
    spots[spotIndex].currentPrice = currentPrice;
    spots[spotIndex].profit = profit;
    spots[spotIndex].profitRate = profitRate;
    localStorage.setItem("spots", JSON.stringify(spots));
  }

  console.log(currentPrice);

  updateBalance();
}

// Add an event listener to all "Refresh" buttons in the table
var refreshButtons = document.querySelectorAll("#table button.btn-outline-primary");
refreshButtons.forEach(button => {
  button.addEventListener("click", function() {
    refreshRow(this);
  });
});

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

  updateBalance();
};

function updateBalance() {
  var spots = JSON.parse(localStorage.getItem("spots"));
  var currentProfit = 0;
  var currentBalance = 0;

  if (spots !== null) {
    for (var i = 0; i < spots.length; i++) {
      currentBalance += parseFloat(spots[i].miktar); // Convert the miktar to a number
    }
  }

  if (spots !== null) {
    for (var i = 0; i < spots.length; i++) {
      currentProfit += parseFloat(spots[i].profit); // Convert the profit to a number
    }
  }

  var walletPrice = currentBalance + currentProfit;

  var balanceDiv = document.getElementById("bakiye");
  balanceDiv.textContent = "Current Balance : " + walletPrice.toFixed(3) + "$";

  var pnlDiv = document.getElementById("pnl");
  pnlDiv.textContent = "Current PNL : " + currentProfit.toFixed(2) + "$";
}


function clearTable() {
  var table = document.getElementById("table");

  while(table.rows.length > 1) {
    table.deleteRow(-1);
  }

  localStorage.removeItem("spots");
};

window.onload = async function() {
  // Get the spots data from localStorage and populate the table
  var spots = JSON.parse(localStorage.getItem("spots"));
  if (spots !== null) {
    var table = document.getElementById("table");
    for (var i = 0; i < spots.length; i++) {
      var row = table.insertRow(-1);
      var coinCell = row.insertCell(0);
      var miktarCell = row.insertCell(1);
      var firstpriceCell = row.insertCell(2);
      var currentpriceCell = row.insertCell(3);
      var profitCell = row.insertCell(4);
      var profitRateCell = row.insertCell(5);
      var actionCell = row.insertCell(6);
      var refreshCell = row.insertCell(7);
      var finishCell = row.insertCell(8);

      coinCell.innerHTML = spots[i].coin;
      miktarCell.innerHTML = spots[i].miktar;
      firstpriceCell.innerHTML = spots[i].firstprice;

      actionCell.innerHTML = '<button onclick="deleteRow(this)" class="btn btn-outline-danger"><i class="fas fa-trash-alt"></i></button>';
      refreshCell.innerHTML = '<button onclick="refreshRow(this)" id="rbtn" class="btn btn-outline-primary"><i class="fas fa-sync-alt"></i></button>';
      finishCell.innerHTML = '<button onclick="finishRow(this)" class="btn btn-success">Sold<i class="fas fa-check"></i></button>';

      var coin = spots[i].coin;
      var miktar = spots[i].miktar;
      var firstprice = spots[i].firstprice;

      // Retrieve the current price of the coin from Coingecko API
      var apiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=" + coin + "&vs_currencies=usd";
      var response = await fetch(apiUrl);
      var data = await response.json();
      var currentPrice = data[coin.toLowerCase()].usd;

      // Calculate the profit and profit rate
      var profit = (currentPrice / firstprice) * miktar - miktar;
      var profitRate = (profit / miktar) * 100;

      currentpriceCell.innerHTML = currentPrice;
      profitCell.innerHTML = profit.toFixed(2);
      profitRateCell.innerHTML = profitRate.toFixed(2) + "%";

      // Set the color of the profitRateCell based on the value
      if (profitRate > 0) {
        profitRateCell.style.color = "green";
      } else if (profitRate < 0) {
        profitRateCell.style.color = "red";
      }

      if (profit > 0) {
        profitCell.style.color = "green";
      } else if (profit < 0) {
        profitCell.style.color = "red";
      }
    }
  }

  updateBalance();
};

