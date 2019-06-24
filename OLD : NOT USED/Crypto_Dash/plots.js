var dates=[]; 
var openingPrices=[]; 
var highPrices=[]; 
var lowPrices=[];
var closingPrices=[];
var unit_volume=[];
var new_dates=[];

function buildPlot() {
  //upload csv file, need to enter python -m http.server in the local directory first 
  d3.csv("3Y_BTC_5-15-19.csv").then(function(data) { //here's my CSV file with ~10 columns 

    data.forEach(function(ddd) {  // each ddd is an object that is one row of data from the CSV
    var new_data=Object.values(ddd); //transform object into an array 
      
      var formattedDate = new_data[1].slice(0, 4) + "-" + new_data[1].slice(4, 6) + "-" + new_data[1].slice(6, 8); // changes from YYYYMMDD to YYYY-MM-DD for plotyly
      dates.push(formattedDate); //push to dates array
      openingPrices.push(+new_data[2]);//open  
      highPrices.push(+new_data[3]);//high
      lowPrices.push(+new_data[4]);//low 
      closingPrices.push(+new_data[5]);//close
      unit_volume.push(+new_data[7])//$ volume 

    });

    new_dates=Object.values(dates); //transform object into an array 
    console.log("typeof new dates: ",typeof(new_dates), " new dates [0]", new_dates[0]);

  //});
  console.log("typeof dates: ",typeof(dates), "dates [0]", dates);
      var name = "Bitcoin";
      var stock = "BTC";
      var startDate = new_dates[0];
      var endDate = new_dates.slice(-1).pop();
      // Candlestick Trace
      var trace1 = {
        type: "candlestick",
        x: dates,
        high: highPrices,
        low: lowPrices,
        open: openingPrices,
        close: closingPrices
      };
      var trace2 = {
        type: "bar",
        //mode: "lines",
        name: "volume",
        x: dates,
        y: unit_volume,
        bar: {
          color: "#17BECF"
        }
      };


      var data = [trace1, trace2];
  //go back and read up on the diff't arguments you can send 
      var layout = {
        title: `Aggregate Exchange Bitcoin Price`,
        margin: {
          r: 10, 
          t: 20, 
          b: 10, 
          l: 10
        }, 
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
    });    
}

buildPlot();
