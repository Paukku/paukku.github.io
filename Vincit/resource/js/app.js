var data;
var unix1, unix2;
var url;
var day1, day2;
var date
var list = [];

$(document).ready(function(){
  $("#datepicker-1").datepicker({
    firstDay: 1,
    maxDate: 0,
    dateFormat: 'dd/mm/yy',
    numberOfMonths: 1,
    onSelect: function(day1) {
      $("#datepicker-2").datepicker("option","minDate", day1)
      day1 = $(this).datepicker("getDate");
      unix1 = parseInt(day1 / 1000);
    }
  });

  $("#datepicker-2").datepicker({ 
    firstDay: 1,
    maxDate: 0,
    dateFormat: 'dd/mm/yy',
    numberOfMonths: 1,
    onSelect: function(day2) {
        $("#datepicker-1").datepicker("option","maxDate", day2)
        day2 = $(this).datepicker("getDate");
        unix2 = parseInt(day2/ 1000);
    }      
  });
});


function createUrl(event) {
  if(!unix1 || !unix2){
    alert ("Please, select both dates in the calendar");
  }
  else if(unix1 == unix2){
    alert ("Please, select different dates in the calendar");
  }
  else {
    unix2 += 3600;
    url = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=' + unix1 + '&to=' + unix2
    checkDataRange(url);
    buyAndSell(url);
  }
}

function checkDataRange(url) {
  $.getJSON(url, function(data){
         
    var x = 0;
    var y = data["prices"][0][1];
    var z = 0;
    var total = 1;
    var highestPrice = 0;
    var lowestPrice = y;
    var hpDay;
    var lowDay = data["prices"][0][0];
    
    for(x; x < data["prices"].length; x++) {
      if (y < data["prices"][x][1]) {
        y = data["prices"][x][1];
        z++;
      }
      else {
        if(z > total) {
          total = z;
          z = 0;
        }
        if(y > highestPrice) {
          highestPrice = y;
          hpDay = data["prices"][x][0];
        }
      }
    }
    message(total, highestPrice, hpDay);
  });
}

function buyAndSell (url) {
  $.getJSON(url, function(data){       
    var x = 0;
    var z = 0;
    var y = data["prices"][0][1];
    var a = data["prices"][0][0];
    var sellPrice = y;
    var buyPrice = y;
    var buyDay = data["prices"][0][0];
    var sellDay = data["prices"][0][0];
    
    for(x; x < data["prices"].length; x++) {
      if(y > data["prices"][x][1]){
        y = data["prices"][x][1];
        a = data["prices"][x][0];
      }

      else {
        if(z < data["prices"][x][1]){
          z = data["prices"][x][1];
          sellDay = data["prices"][x][0];

          if(a <= sellDay){
            if(sellPrice - buyPrice < z - y) {
              sellPrice = z;
              buyPrice = y;
              buyDay = a;
            }
          }
        }
      }
    }
    var total = sellPrice - buyPrice;
    messageTimeMachine(total, buyDay, sellDay);
  });
}


function changeUnix(uni) {
  date = new Date(uni * 1000);  
  date = date.toLocaleDateString('en-GB');
  return date;
}

function changeGeckoUni(unix) {
  date = new Date(unix);  
  date = date.toLocaleString('en-GB');
  return date;
}


function message (total, highestPrice, hpDay) {
  day1 = changeUnix(unix1);
  day2 = changeUnix(unix2);
  hpDay = changeGeckoUni(hpDay);

  
  var message = "For " + day1 + " to " + day2 + " the price decreased " + total + " days in a row.<br> "  ;
  list.push(message);
  var message2 = "Highest price was " + hpDay + " and the price was " + highestPrice + " eur.<br>";
  list.push(message2);
  document.getElementById("decrease").innerHTML = "Decreaces of bitcoin: <br> " + list.join('');
  document.getElementById("data").innerHTML = "Data is from <a href='https://www.coingecko.com/en'>CoinGecko</a>";
}

function messageTimeMachine (total, buyDay, sellDay) {
  buyDay = changeGeckoUni(buyDay);
  sellDay = changeGeckoUni(sellDay);
  var message = '';

  if(total <= 0) {
    message = "Don't buy or sell bitcoins on any if the days.<br>";
    document.getElementById("buyorsell").innerHTML = message;
  }
  else {
    message = "Buy bitcoins to " + buyDay + " and sell them to " + sellDay + " Profit is " + total + " eur.<br>";
    document.getElementById("buyorsell").innerHTML = message;
  }
}