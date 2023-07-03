async function submitForm() {
    // Form verilerini al
    var coin = document.getElementById("coin").value;
    var leverage = document.getElementById("leverage").value;
    var entryPrice = document.getElementById("entry-price").value;
    var amount = document.getElementById("amount").value;

    var apiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=" + coin + "&vs_currencies=usd";
    var response = await fetch(apiUrl);
    var data = await response.json();
    var currentPrice = data[coin.toLowerCase()].usd;

    var profit = ((currentPrice / entryPrice) * amount - amount)*leverage;
    var profitRate = (profit / amount) * 100;

     // Verileri objeye ekle
     var trade = {
        coin: coin,
        leverage: leverage,
        entryPrice: entryPrice,
        amount: amount,
        currentPrice:currentPrice,
        profit:profit,
        profitRate:profitRate,
      };
   // Objeyi localStorage'ye ekle
    if (localStorage.getItem("trades") === null) {
        localStorage.setItem("trades", "[]");
    }
    var trades = JSON.parse(localStorage.getItem("trades"));
    trades.push(trade);
    localStorage.setItem("trades", JSON.stringify(trades));
  

    // Yeni bir tablo satırı oluştur
    var table = document.getElementById("trade-table");
    var row = table.insertRow(-1);

    // Verileri tabloya ekle
    var coinCell = row.insertCell(0);
    var amountCell = row.insertCell(1);
    var leverageCell = row.insertCell(2);
    var entryPriceCell = row.insertCell(3);
    var currentpriceCell = row.insertCell(4);
    var profitCell = row.insertCell(5);
    var profitRateCell = row.insertCell(6);
    var actionCell = row.insertCell(7);
    var refreshCell = row.insertCell(8);

    coinCell.innerHTML = coin;
    leverageCell.innerHTML = leverage;
    entryPriceCell.innerHTML = entryPrice;
    amountCell.innerHTML = amount;
    currentpriceCell.innerHTML = currentPrice;
    profitCell.innerHTML = profit.toFixed(2);
    profitRateCell.innerHTML = profitRate.toFixed(2) + "%";

    actionCell.innerHTML = '<button onclick="deleteRow(this)" class="btn btn-outline-danger"><i class="fas fa-trash"></i></button>';
    refreshCell.innerHTML = '<button onclick="refreshRow(this)" id="rbtn" class="btn btn-outline-primary"><i class="fas fa-sync-alt"></i></button>';

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
  var currentpriceCell = row.cells[4];
  currentpriceCell.innerHTML = currentPrice;

  // Recalculate the profit and profit rate for the row
  var amount = parseFloat(row.cells[1].innerHTML);
  var leverage = parseFloat(row.cells[2].innerHTML);
  var entryPrice = parseFloat(row.cells[3].innerHTML);
  var profit = ((currentPrice / entryPrice) * amount - amount)*leverage;
  var profitRate = (profit / amount) * 100;
  var profitCell = row.cells[5];
  var profitRateCell = row.cells[6];
  profitCell.innerHTML = profit.toFixed(2);
  profitRateCell.innerHTML = profitRate.toFixed(2) + "%";

  console.log(currentPrice);
}

var refreshButtons = document.querySelectorAll("#trade-table button.btn-outline-primary");
refreshButtons.forEach(button => {
  button.addEventListener("click", function() {
    refreshRow(this);
  });
});

function deleteRow(button) {
  // Get the row that the button is in
  var row = button.parentNode.parentNode;
  
  // Get the trade data from the row cells
  var coin = row.cells[0].innerHTML;
  var amount = row.cells[1].innerHTML;
  var leverage = row.cells[2].innerHTML;
  var entryPrice = row.cells[3].innerHTML;
  
  
  // Remove the row from the table
  row.parentNode.removeChild(row);
  
  // Remove the trade data from localStorage
  var trades = JSON.parse(localStorage.getItem("trades"));
  var index = -1;
  for (var i = 0; i < trades.length; i++) {
  if (trades[i].coin === coin && trades[i].leverage === leverage && trades[i].entryPrice === entryPrice  && trades[i].amount === amount) {
  index = i;
  break;
  }
  }
  if (index > -1) {
  trades.splice(index, 1);
  localStorage.setItem("trades", JSON.stringify(trades));
  }
  };

  //
  window.onload = async function() {
    // Get the spots data from localStorage and populate the table
    var trades = JSON.parse(localStorage.getItem("trades"));
    if (trades !== null) {
      var table = document.getElementById("trade-table");
      for (var i = 0; i < trades.length; i++) {
        var row = table.insertRow(-1);
        var coinCell = row.insertCell(0);
        var amountCell = row.insertCell(1);
        var leverageCell = row.insertCell(2)
        var entryPriceCell = row.insertCell(3)
        var currentpriceCell = row.insertCell(4);
        var profitCell = row.insertCell(5);
        var profitRateCell = row.insertCell(6);
        var actionCell = row.insertCell(7);
        var refreshCell = row.insertCell(8);
  
        coinCell.innerHTML = trades[i].coin;
        amountCell.innerHTML = trades[i].amount;
        leverageCell.innerHTML = trades[i].leverage;
        entryPriceCell.innerHTML = trades[i].entryPrice;
  
        actionCell.innerHTML = '<button onclick="deleteRow(this)" class="btn btn-outline-danger"><i class="fas fa-trash-alt"></i></button>';
        refreshCell.innerHTML = '<button onclick="refreshRow(this)" id="rbtn" class="btn btn-outline-primary"><i class="fas fa-sync-alt"></i></button>';
  
        var coin = trades[i].coin;
        var amount = trades[i].amount;
        var entryPrice = trades[i].entryPrice;
  
        // Retrieve the current price of the coin from Coingecko API
        var apiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=" + coin + "&vs_currencies=usd";
        var response = await fetch(apiUrl);
        var data = await response.json();
        var currentPrice = data[coin.toLowerCase()].usd;
  
        // Calculate the profit and profit rate
        var profit = (currentPrice / entryPrice) * amount - amount;
        var profitRate = (profit / amount) * 100;
  
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
  }; 

  function clearTable() {
    var table = document.getElementById("trade-table");
  
    while(table.rows.length > 1) {
      table.deleteRow(-1);
    }
  
    localStorage.removeItem("trades");
  }