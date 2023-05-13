function submitForm(){

    var coin = document.getElementById("coin").value;
    var miktar = document.getElementById("miktar").value;
    var firstprice = document.getElementById("firstprice").value;
    var endprice = document.getElementById("endprice").value;
    var pnl = document.getElementById("pnl").value;
    
    var spot = {
      coin:coin,
      miktar:miktar,
      firstprice:firstprice,
      endprice:endprice,
      pnl:pnl
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
    var endpriceCell = row.insertCell(3);
    var pnlCell = row.insertCell(4);
    var actionCell = row.insertCell(5);
    
    coinCell.innerHTML = coin;
    miktarCell.innerHTML = miktar;
    firstpriceCell.innerHTML = firstprice;
    endpriceCell.innerHTML = endprice;
    
    // Change text color based on pnl value
    if (pnl >= 0) {
      pnlCell.style.color = 'green';
    } else {
      pnlCell.style.color = 'red';
    }
    
    pnlCell.innerHTML = pnl;
    actionCell.innerHTML = '<button onclick="deleteRow(this)" class="btn btn-outline-danger"><i class="bi bi-trash"></i>Sil</button>';
    
  };
  
  function deleteRow(button) {
    // Get the row that the button is in
    var row = button.parentNode.parentNode;
    
    // Get the spot data from the row cells
    var coin = row.cells[0].innerHTML;
    var miktar = row.cells[1].innerHTML;
    var firstprice = row.cells[2].innerHTML;
    var endprice = row.cells[3].innerHTML;
    var pnl = row.cells[4].innerHTML;
    
    // Remove the row from the table
    row.parentNode.removeChild(row);
    
    // Remove the spot data from localStorage
    var spots = JSON.parse(localStorage.getItem("spots"));
    var index = -1;
    for (var i = 0; i < spots.length; i++) {
    if (spots[i].coin === coin && spots[i].miktar === miktar && spots[i].firstprice === firstprice && spots[i].endprice === endprice && spots[i].pnl === pnl) {
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
        var endpriceCell = row.insertCell(3);
        var pnlCell = row.insertCell(4);
        var actionCell = row.insertCell(5);
        coinCell.innerHTML = spots[i].coin;
        miktarCell.innerHTML = spots[i].miktar;
        firstpriceCell.innerHTML = spots[i].firstprice;
        endpriceCell.innerHTML = spots[i].endprice;
        pnlCell.innerHTML = spots[i].pnl;
        if (spots[i].pnl >= 0) {
          pnlCell.style.color = 'green';
        } else {
          pnlCell.style.color = 'red';
        }
        actionCell.innerHTML = '<button onclick="deleteRow(this)" class="btn btn-outline-danger"><i class="bi bi-trash"></i>Sil</button>';
      }
    }
  };
  