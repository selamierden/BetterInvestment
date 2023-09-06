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
  };
  
  function clearTable() {
    var table = document.getElementById("table");
  
    while(table.rows.length > 1) {
      table.deleteRow(-1);
    }
  
    localStorage.removeItem("spots");
  };
  
  
  window.onload = function() {
    // Get the "spots" data from localStorage and populate the table
    var spots = JSON.parse(localStorage.getItem("spots"));
    if (spots !== null) {
      var table = document.getElementById("table");
      for (var i = 0; i < spots.length; i++) {
        var row = table.insertRow(-1);
        var coinCell = row.insertCell(0);
        var miktarCell = row.insertCell(1);
        var firstpriceCell = row.insertCell(2);
        var currentPriceCell = row.insertCell(3);
        var leverageCell = row.insertCell(4);
        var yonCell = row.insertCell(5);
        var profitCell = row.insertCell(6);
        var actionCell = row.insertCell(7);
        coinCell.innerHTML = spots[i].coin;
        miktarCell.innerHTML = spots[i].miktar;
        firstpriceCell.innerHTML = spots[i].firstprice;
        currentPriceCell.innerHTML = spots[i].currentPrice;
        leverageCell.innerHTML = spots[i].leverage;
        yonCell.innerHTML = spots[i].yon;
        profitCell.innerHTML = spots[i].profit;
        if (spots[i].profit >= 0) {
          profitCell.style.color = 'green';
        } else {
          profitCell.style.color = 'red';
        }
        actionCell.innerHTML = '<button onclick="deleteRow(this)" class="btn btn-outline-danger"><i class="bi bi-trash"></i>Sil</button>';
      }
    }
  
    // Get the "sold" data from localStorage and populate the table
    var sold = JSON.parse(localStorage.getItem("sold"));
    if (sold !== null) {
      var table = document.getElementById("table");
      for (var i = 0; i < sold.length; i++) {
        var row = table.insertRow(-1);
        var coinCell = row.insertCell(0);
        var miktarCell = row.insertCell(1);
        var firstpriceCell = row.insertCell(2);
        var currentPriceCell = row.insertCell(3);
        var leverageCell = row.insertCell(4);
        var yonCell = row.insertCell(5);
        var profitCell = row.insertCell(6);
        var actionCell = row.insertCell(7);
        coinCell.innerHTML = sold[i].coin;
        miktarCell.innerHTML = sold[i].miktar;
        firstpriceCell.innerHTML = sold[i].firstprice;
        currentPriceCell.innerHTML = sold[i].currentPrice;
        leverageCell.innerHTML = sold[i].leverage;
        yonCell.innerHTML = sold[i].yon;
        profitCell.innerHTML = sold[i].profit;
        if (sold[i].profit >= 0) {
          profitCell.style.color = 'green';
        } else {
          profitCell.style.color = 'red';
        }
        // actionCell.innerHTML = '<button onclick="deleteRow(this)" class="btn btn-outline-danger"><i class="bi bi-trash"></i>Sil</button>';
      }
    }
  };
  
  
  