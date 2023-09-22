function submitForm(){

    var coin = document.getElementById("coin").value;
    var miktar = document.getElementById("miktar").value;
    var firstprice = document.getElementById("firstprice").value;
    var currentPrice = document.getElementById("endprice").value;   //endprice
    var profit = document.getElementById("pnl").value;
    var leverage = document.getElementById("leverage").value;
    var yon = document.getElementById("yon").value;
    
    var spot = {
      coin:coin,
      miktar:miktar,
      firstprice:firstprice,
      currentPrice:currentPrice,
      profit:profit,
      leverage:leverage,
      yon:yon
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
    var currentPriceCell = row.insertCell(3);
    var leverageCell = row.insertCell(4);
    var yonCell = row.insertCell(5);
    var profitCell = row.insertCell(6);
    var actionCell = row.insertCell(7);
    
    coinCell.innerHTML = coin;
    miktarCell.innerHTML = miktar;
    firstpriceCell.innerHTML = firstprice;
    currentPriceCell.innerHTML = currentPrice;
    leverageCell.innerHTML = leverage;
    yonCell.innerHTML = yon;
    
    // Change text color based on pnl value
    if (profit >= 0) {
      profitCell.style.color = 'green';
    } else {
      profitCell.style.color = 'red';
    }
    
    profitCell.innerHTML = profit;
    actionCell.innerHTML = '<button onclick="deleteRow(this)" class="btn btn-outline-danger"><i class="bi bi-trash"></i>Sil</button>';

    updateBalance()
    
};
  
  function deleteRow(button) {
    // Get the row that the button is in
    var row = button.parentNode.parentNode;
    
    // Get the spot data from the row cells
    var coin = row.cells[0].innerHTML;
    var miktar = row.cells[1].innerHTML;
    var firstprice = row.cells[2].innerHTML;
    var currentPrice = row.cells[3].innerHTML;
    var leverage = row.cells[4].innerHTML;
    var yon = row.cells[5].innerHTML;
    var profit = row.cells[6].innerHTML;
    
    // Remove the row from the table
    row.parentNode.removeChild(row);
    
    // Remove the spot data from localStorage
    var spots = JSON.parse(localStorage.getItem("spots"));
    var index = -1;
    for (var i = 0; i < spots.length; i++) {
    if (spots[i].coin === coin && spots[i].miktar === miktar && spots[i].firstprice === firstprice && spots[i].currentPrice === currentPrice && spots[i].leverage === leverage && spots[i].profit === profit && spots[i].yon === yon) {
    index = i;
    break;
    }
    }
    if (index > -1) {
    spots.splice(index, 1);
    localStorage.setItem("spots", JSON.stringify(spots));
    }

    updateBalance()
};
  
  function clearTable() {
    var table = document.getElementById("table");
  
    while(table.rows.length > 1) {
      table.deleteRow(-1);
    }
  
    localStorage.removeItem("spots");

    updateBalance()
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
  
    var pnlDiv = document.getElementById("pl");
    pnlDiv.textContent = "Current PNL : " + currentProfit.toFixed(2) + "$";
};

  document.addEventListener("DOMContentLoaded", function() {
    updateBalance();
});
  
  function populateTableFromLocalStorage(data, tableId) {
    var table = document.getElementById(tableId);
  
    if (data !== null) {
      for (var i = 0; i < data.length; i++) {
        var row = table.insertRow(-1);
        var coinCell = row.insertCell(0);
        var miktarCell = row.insertCell(1);
        var firstpriceCell = row.insertCell(2);
        var currentPriceCell = row.insertCell(3);
        var leverageCell = row.insertCell(4);
        var yonCell = row.insertCell(5);
        var profitCell = row.insertCell(6);
        var actionCell = row.insertCell(7);
  
        coinCell.innerHTML = data[i].coin;
        miktarCell.innerHTML = data[i].miktar;
        firstpriceCell.innerHTML = data[i].firstprice;
        currentPriceCell.innerHTML = data[i].currentPrice;
        leverageCell.innerHTML = data[i].leverage;
        yonCell.innerHTML = data[i].yon;
        profitCell.innerHTML = data[i].profit;
  
        if (data[i].profit >= 0) {
          profitCell.style.color = 'green';
        } else {
          profitCell.style.color = 'red';
        }
  
        actionCell.innerHTML = '<button onclick="deleteRow(this)" class="btn btn-outline-danger"><i class="bi bi-trash"></i>Sil</button>';
      }
    }
};
  
  window.onload = function () {
    var spots = JSON.parse(localStorage.getItem("spots"));
    populateTableFromLocalStorage(spots, "table");
  
    var sold = JSON.parse(localStorage.getItem("sold"));
    populateTableFromLocalStorage(sold, "table");
};

  