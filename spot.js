async function submitForm(){

  var coin = document.getElementById("coin").value;
  var miktar = document.getElementById("miktar").value;
  var firstprice = document.getElementById("firstprice").value;
  var leverage = document.getElementById("kaldirac").value;

  if(leverage === ""){
    leverage = 1;
  }

  
  // Retrieve the current price of the coin from Coingecko API
  var apiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=" + coin + "&vs_currencies=usd";
  var response = await fetch(apiUrl);
  var data = await response.json();
  var currentPrice = data[coin.toLowerCase()].usd;

  // Calculate the profit and profit rate
  var profit = ((currentPrice / firstprice) * miktar - miktar) * leverage;
  var profitRate = (profit / miktar) * 100;
  
  var spot = {
    coin:coin,
    miktar:miktar,
    firstprice:firstprice,
    leverage:leverage,
    currentPrice:currentPrice,
    profit:profit,
    profitRate:profitRate,
  };
  
  if(localStorage.getItem("cspots") === null){
    localStorage.setItem("cspots", "[]");
  }
  
  var cspots = JSON.parse(localStorage.getItem("cspots"));
  cspots.push(spot);
  localStorage.setItem("cspots",JSON.stringify(cspots));
  
  var table = document.getElementById("table");
  var row = table.insertRow(-1);
  
  var coinCell = row.insertCell(0);
  var miktarCell = row.insertCell(1);
  var firstpriceCell = row.insertCell(2);
  var currentpriceCell = row.insertCell(3);
  var leverageCell = row.insertCell(4);
  var profitCell = row.insertCell(5);
  var profitRateCell = row.insertCell(6);
  var actionCell = row.insertCell(7);
  var refreshCell = row.insertCell(8);
  var finishCell = row.insertCell(9);

  
  coinCell.innerHTML = coin;
  miktarCell.innerHTML = miktar;
  firstpriceCell.innerHTML = firstprice;
  leverageCell.innerHTML = leverage;
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
  var profitCell = row.cells[5];
  var profitRateCell = row.cells[6];
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
  var cspots = JSON.parse(localStorage.getItem("cspots"));
  var spotIndex = -1;
  for (var i = 0; i < cspots.length; i++) {
    if (
      cspots[i].coin === coin &&
      parseFloat(cspots[i].miktar) === miktar &&
      parseFloat(cspots[i].firstprice) === firstprice
    ) {
      spotIndex = i;
      break;
    }
  }

  if (spotIndex !== -1) {
    cspots[spotIndex].currentPrice = currentPrice;
    cspots[spotIndex].profit = profit;
    cspots[spotIndex].profitRate = profitRate;
    localStorage.setItem("cspots", JSON.stringify(cspots));
  }


  updateBalance();
}

function finishRow(button) {
  // Get the row that the button is in
  var row = button.parentNode.parentNode;
  
  // Get the spot data from the row cells
  var coin = row.cells[0].innerHTML;
  var miktar = row.cells[1].innerHTML;
  var firstprice = row.cells[2].innerHTML;
  var currentPrice = row.cells[3].innerHTML;
  var leverage = row.cells[4].innerHTML;
  var profit = row.cells[5].innerHTML;
  // var profitRate = row.cells[5].innerHTML;
  
  // Create a new "sold" object with the sold data
  var soldData = {
    coin: coin,
    miktar: miktar,
    firstprice: firstprice,
    leverage: leverage,
    currentPrice: currentPrice,
    profit: profit,
    // profitRate: profitRate
  };

  // Get the "sold" array from localStorage or create an empty array if it doesn't exist
  var soldArray = JSON.parse(localStorage.getItem("spots")) || [];

  // Add the soldData object to the "sold" array
  soldArray.push(soldData);

  // Update the "sold" array in localStorage
  localStorage.setItem("spots", JSON.stringify(soldArray));

  // Remove the row from the table
  row.parentNode.removeChild(row);

  // Update the balance after selling
  updateBalance();

  // Remove the sold data from localStorage based on the row's data
  var cspots = JSON.parse(localStorage.getItem("cspots"));
  var index = -1;
  for (var i = 0; i < cspots.length; i++) {
    if (
      cspots[i].coin === coin &&
      cspots[i].miktar === miktar &&
      cspots[i].firstprice === firstprice
    ) {
      index = i;
      break;
    }
  }

  if (index > -1) {
    cspots.splice(index, 1);
    localStorage.setItem("cspots", JSON.stringify(cspots));
  }
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
  var leverage = row.cells[4].innerHTML;
  
  // Remove the row from the table
  row.parentNode.removeChild(row);
  
  // Remove the spot data from localStorage
  var cspots = JSON.parse(localStorage.getItem("cspots"));
  var index = -1;
  for (var i = 0; i < cspots.length; i++) {
  if (cspots[i].coin === coin && cspots[i].miktar === miktar && cspots[i].firstprice === firstprice && cspots[i].leverage === leverage) {
  index = i;
  break;
  }
  }
  if (index > -1) {
  cspots.splice(index, 1);
  localStorage.setItem("cspots", JSON.stringify(cspots));
  }

  updateBalance();
};

function updateBalance() {
  var cspots = JSON.parse(localStorage.getItem("cspots"));
  var currentProfit = 0;
  var currentBalance = 0;

  if (cspots !== null) {
    for (var i = 0; i < cspots.length; i++) {
      currentBalance += parseFloat(cspots[i].miktar); // Convert the miktar to a number
    }
  }

  if (cspots !== null) {
    for (var i = 0; i < cspots.length; i++) {
      currentProfit += parseFloat(cspots[i].profit); // Convert the profit to a number
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

  localStorage.removeItem("cspots");
};

window.onload = async function() {
  // Get the spots data from localStorage and populate the table
  var cspots = JSON.parse(localStorage.getItem("cspots"));
  if (cspots !== null) {
    var table = document.getElementById("table");
    for (var i = 0; i < cspots.length; i++) {
      var row = table.insertRow(-1);
      var coinCell = row.insertCell(0);
      var miktarCell = row.insertCell(1);
      var firstpriceCell = row.insertCell(2);
      var currentpriceCell = row.insertCell(3);
      var leverageCell = row.insertCell(4);
      var profitCell = row.insertCell(5);
      var profitRateCell = row.insertCell(6);
      var actionCell = row.insertCell(7);
      var refreshCell = row.insertCell(8);
      var finishCell = row.insertCell(9);

      coinCell.innerHTML = cspots[i].coin;
      miktarCell.innerHTML = cspots[i].miktar;
      firstpriceCell.innerHTML = cspots[i].firstprice;
      leverageCell.innerHTML = cspots[i].leverage;

      actionCell.innerHTML = '<button onclick="deleteRow(this)" class="btn btn-outline-danger"><i class="fas fa-trash-alt"></i></button>';
      refreshCell.innerHTML = '<button onclick="refreshRow(this)" id="rbtn" class="btn btn-outline-primary"><i class="fas fa-sync-alt"></i></button>';
      finishCell.innerHTML = '<button onclick="finishRow(this)" class="btn btn-success">Sold<i class="fas fa-check"></i></button>';

      var coin = cspots[i].coin;
      var miktar = cspots[i].miktar;
      var firstprice = cspots[i].firstprice;
      var leverage = cspots[i].leverage;

      // Retrieve the current price of the coin from Coingecko API
      var apiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=" + coin + "&vs_currencies=usd";
      var response = await fetch(apiUrl);
      var data = await response.json();
      var currentPrice = data[coin.toLowerCase()].usd;

      // Calculate the profit and profit rate
      var profit = ((currentPrice / firstprice) * miktar - miktar) * leverage;
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

