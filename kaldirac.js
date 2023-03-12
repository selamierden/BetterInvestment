function submitForm() {
    // Form verilerini al
    var coin = document.getElementById("coin").value;
    var leverage = document.getElementById("leverage").value;
    var entryPrice = document.getElementById("entry-price").value;
    var exitPrice = document.getElementById("exit-price").value;
    var profitLoss = document.getElementById("profit-loss").value;

     // Verileri objeye ekle
     var trade = {
        coin: coin,
        leverage: leverage,
        entryPrice: entryPrice,
        exitPrice: exitPrice,
        profitLoss: profitLoss
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
    var leverageCell = row.insertCell(1);
    var entryPriceCell = row.insertCell(2);
    var exitPriceCell = row.insertCell(3);
    var profitLossCell = row.insertCell(4);
    var actionCell = row.insertCell(5);

    coinCell.innerHTML = coin;
    leverageCell.innerHTML = leverage;
    entryPriceCell.innerHTML = entryPrice;
    exitPriceCell.innerHTML = exitPrice;

    if (profitLoss >= 0) {
      profitLossCell.style.color = 'green';
      } else {
      profitLossCell.style.color = 'red';
      }

    profitLossCell.innerHTML = profitLoss;
    actionCell.innerHTML = '<button onclick="deleteRow(this)" class="btn btn-outline-danger"><i class="bi bi-trash"></i>Sil</button>';
};

function deleteRow(button) {
  // Get the row that the button is in
  var row = button.parentNode.parentNode;
  
  // Get the spot data from the row cells
  var coin = row.cells[0].innerHTML;
  var leverage = row.cells[1].innerHTML;
  var entryPrice = row.cells[2].innerHTML;
  var exitprice = row.cells[3].innerHTML;
  var profitLoss = row.cells[4].innerHTML;
  
  // Remove the row from the table
  row.parentNode.removeChild(row);
  
  // Remove the spot data from localStorage
  var trades = JSON.parse(localStorage.getItem("trades"));
  var index = -1;
  for (var i = 0; i < trades.length; i++) {
  if (trades[i].coin === coin && trades[i].leverage === leverage && trades[i].entryPrice === entryPrice && trades[i].exitPrice === exitprice && trades[i].profitLoss === profitLoss) {
  index = i;
  break;
  }
  }
  if (index > -1) {
  trades.splice(index, 1);
  localStorage.setItem("trades", JSON.stringify(trades));
  }
  };

// sayfa yüklendiğinde çalışacak fonksiyon
window.onload = function() {
  // Retrieve the trades from localStorage
  var trades = JSON.parse(localStorage.getItem("trades"));

  // If there are trades in localStorage, add them to the table
  if (trades !== null && trades.length > 0) {
    var table = document.getElementById("trade-table");

    for (var i = 0; i < trades.length; i++) {
      var trade = trades[i];

      var row = table.insertRow(-1);
      var coinCell = row.insertCell(0);
      var leverageCell = row.insertCell(1);
      var entryPriceCell = row.insertCell(2);
      var exitPriceCell = row.insertCell(3);
      var profitLossCell = row.insertCell(4);
      var actionCell = row.insertCell(5);

      coinCell.innerHTML = trade.coin;
      leverageCell.innerHTML = trade.leverage;
      entryPriceCell.innerHTML = trade.entryPrice;
      exitPriceCell.innerHTML = trade.exitPrice;

      // Change text color based on profit/loss value
      if (trade.profitLoss >= 0) {
        profitLossCell.style.color = 'green';
      } else {
        profitLossCell.style.color = 'red';
      }

      profitLossCell.innerHTML = trade.profitLoss;
      actionCell.innerHTML = '<button onclick="deleteRow(this)" class="btn btn-outline-danger"><i class="bi bi-trash"></i>Sil</button>';
    }
  }
}

  
  function clearTable() {
    var table = document.getElementById("trade-table");
  
    while(table.rows.length > 1) {
      table.deleteRow(-1);
    }
  
    localStorage.removeItem("trades");
  }