
var dates=[]; 
var openingPrices=[]; 
var highPrices=[]; 
var lowPrices=[];
var closingPrices=[];
var unit_volume=[];

/*
function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}
*/
function buildPlot(stock) {
  //upload csv file, need to enter python -m http.server in the local directory first 
d3.csv("3Y_BTC_5-15-19.csv").then(function(data) { //here's my CSV file with ~10 columns 

var parseTime = d3.timeParse("%yyyy-%M-%d"); // create a timeParse variable 


  data.forEach(function(ddd) {  // each ddd is an object that is one row of data from the CSV
  var new_data=Object.values(ddd); //transform object into an array 
    formattedDate= parseTime(new_data[1]);
   
    console.log(new_data[1]);
    console.log(formattedDate);
    
    //var formattedDate = new_data[1].slice(0, 4) + "-" + new_data[1].slice(4, 6) + "-" + new_data[1].slice(6, 8); // changes from YYYYMMDD to YYYY-MM-DD for plotyly
    dates.push(formattedDate); //push to dates array
    openingPrices.push(+new_data[2]);//open  
    highPrices.push(+new_data[3]);//high
    lowPrices.push(+new_data[4]);//low 
    closingPrices.push(+new_data[5]);//close
    unit_volume.push(+new_data[7])//$ volume 
   
  });
  console.log("dates:", dates);
 /* console.log("open:", openingPrices);
  console.log("low:", lowPrices);
  console.log("high:", highPrices);
  console.log("close:", closingPrices);
  console.log("unit volume", unit_volume);
*/
});


    var name = "Bitcoin";
    var stock = "BTC";
    var startDate = dates[1];
    //console.log("dates1",dates[1]);
    var endDate = dates.slice(-1).pop();
    //var startDate = "2016-05-16";
    //var endDate = "2019-05-15";   

console.log("about to go into the graphing")
     // Candlestick Trace
    var trace1 = {
      type: "candlestick",
      x: dates,
      high: highPrices,
      low: lowPrices,
      open: openingPrices,
      close: closingPrices
    };

    var data = [trace1];
//go back and read up on the diff't arguments you can send 
    var layout = {
      title: `Aggregate Exchange Bitcoin Price`,
      xaxis: {
        range: [startDate, endDate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      }
    };

    Plotly.newPlot("plot", data, layout);
    console.log("start date", startDate);
    console.log("end date:", endDate);
    console.log("DONE")
}

buildPlot("TSLA");
