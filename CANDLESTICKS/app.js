
// global variable declarations 
var low=[];
var open=[];
var high=[];
var low=[];
var close=[];
var volume=[];
var date=[];
var finex_shorts=[]; 
var finex_leveraged_longs=[];
var finex_unit_volume=[];
var bitcoin_dominance=[];

//constants - mostly for sizing 
const candle_win_height = 500; //size of the candlestick and volume rect 
const candle_win_width = 1300; //size of the candlestick and volume rect 
const indicator_win_height = 150; //size of indicator rect 
const indicator_win_width = candle_win_width; //size of indicator rect 
const left_margin = 50;
const top_margin = 10;
const indicator_buffer = 20; //small buffer between the volume bars and indicator 1
const candle_win_ratio = 4/5;
const volume_win_ratio = 1/4; 

// Parse the date / time
var parseDate = d3.timeParse("%e %b %y"); // this is D3v4 version, hopefully works 

// get data from CSV and parse the date 
d3.csv("7mos_test_data.csv")
.then(function(data) { // current is d3v5 version (remove then for D3v4)
  data.forEach(function(d) {
    //console.log(d);
    low.push(+d.Low);
    close.push(+d.Close);
    open.push(+d.Open);
    high.push(+d.High);
    volume.push(+d.Volume/1000000);
    finex_leveraged_longs.push(+d.bitfinex_longs);
    finex_shorts.push(+d.bitfinex_shorts);
    bitcoin_dominance.push(+d.bitcoin_dominance);
    date.push(d.Date); // I should have ParseDate here but then nothing shows on x-axis 
  }) 
console.log(data);
indicator_1=finex_shorts;
var indicator_1_label = "Biftinex Short Contracts";
indicator_2=bitcoin_dominance;
var indicator_2_label = "Bitcoin Dominance (% of total cap)";
console.log(open.length, high.length, low.length, close.length, volume.length, date.length, indicator_1.length, indicator_2.length);
console.log(indicator_2);
// Append the SVG cointainer, set its height and width, and create a variable which references it
var svg = d3.select("#svg-area") //1000 width and 500 heihgt good on my laptop
  .append("svg")
  .attr("height", candle_win_height+indicator_win_height+top_margin+indicator_buffer)
  .attr("width", (candle_win_width+left_margin*2)); // ; only for the last one, no , either

  // Append one rectangle for the candlesticks and the volume charts 
svg.append("rect")
  .attr("width", candle_win_width)
  .attr("height", candle_win_height)
  .attr("x", left_margin) //x location   
  .attr("y", top_margin) //y location
  //.attr("color", "green")
  .style("stroke", "grey") // works 
  .style("stroke-width", 2) // works 
  .style("opacity", 1) // works 
  .style("fill", "none"); //works and use "none" instead of false 
  
svg.append("rect") // second rectangle below for the sentiment indicators 
  .attr("width", indicator_win_width)
  .attr("height" ,indicator_win_height)
  .attr("x", left_margin) //x location   
  .attr("y", top_margin+candle_win_height) //y location
  //.attr("color", "green")
  .style("stroke", "grey") // works 
  .style("stroke-width", 2) // works 
  .style("opacity", 1) // works 
  .style("fill", "none"); //works and use "none" instead of false 

  // below is to append legend for indicator text, we can do something fancier
  svg.append("text")            // append text
    .style("fill", "blue")      // make the text black
    //.style("writing-mode", "tb") // set the writing mode
    .style("font", "14px sans-serif")
    .style("stroke", "blue")    
    .attr("x", 100)         // set x position of left side of text
    .attr("y", (candle_win_height+indicator_win_height+top_margin+15)) // set y position of bottom of text
    .text(indicator_1_label);   // define the text to display
  
    // below is to append legend for indicator text, we can do something fancier
  svg.append("text")            // append text
   .style("fill", "blue")      // make the text black
   //.style("writing-mode", "tb") // set the writing mode
   .style("font", "14px sans-serif")
   .style("stroke", "green")    
   .attr("x", candle_win_width-150)         // set x position of left side of text
   .attr("y", (candle_win_height+indicator_win_height+top_margin+15)) // set y position of bottom of text
   .text(indicator_2_label);   // define the text to display

    //variables for volume and candlestick size setup 
var max_volume = Math.max.apply(0, volume);
const vol_max_height = volume_win_ratio*candle_win_height;
const vol_base=candle_win_height;  
var bar_width = candle_win_width/volume.length 

const candlestick_max_height = candle_win_ratio*candle_win_height-top_margin; //for the wicks gives us a 382 range  
var highest_wick = Math.max.apply(0, high); // 
var lowest_wick = d3.min(low); // 
const scaler = candlestick_max_height / (highest_wick-lowest_wick); //scaler for candlestick window 
const max_i1 = d3.max(indicator_1);
const min_i1 = d3.min(indicator_1);
const max_i2 = d3.max(indicator_2);
const min_i2 = d3.min(indicator_2);
const i1_scaler =(indicator_win_height)/(max_i1-min_i1); //scaler for indicator 1
const i2_scaler =(indicator_win_height)/(max_i2-min_i2); //scaler for indicator 2

console.log("i2 scaler", i2_scaler);
var yScale = d3.scaleLinear() // y axis for the candles 
.domain([d3.max(high), d3.min(low)])
.range([0, candle_win_ratio*candle_win_height]);
 // scale y to chart height

var yScale2 = d3.scaleLinear() // 2nd y axis for the trading volume  
.domain([d3.max(volume), 0])//
.range([0, volume_win_ratio*candle_win_height]);
 
var yScale3 = d3.scaleLinear() // 3rd y axis for the FIRST indicator  
 .domain([d3.max(indicator_1), d3.min(indicator_1)])
 .range([0, (indicator_win_height)]); // 

var yScale4 = d3.scaleLinear() // 4th y axis for the SECOND indicator  
 .domain([d3.max(indicator_2), d3.min(indicator_2)])
 .range([0, (indicator_win_height)]); // 

// scale x to chart width
var xScale = d3.scaleTime()//scaleBand()
.domain([d3.min(date), d3.max(date)]) // need to parse the date I think  
.range([0, candle_win_width]);

// create the various axes
var yAxis = d3.axisLeft(yScale) //candlestick y axis 
  .ticks(10); 
var yAxis2 = d3.axisRight(yScale2) // volume y axis
.ticks(5);
var yAxis3 = d3.axisLeft(yScale3) //1st sentiment inidcator y axis
.ticks(6);
var yAxis4 = d3.axisRight(yScale4) //2nd sentiment indicator y axis
.ticks(6);
var xAxis = d3.axisBottom(xScale)
.tickFormat(d3.timeFormat("%e %b %y"))// d3 v4 
.ticks(12); // this one is not working, I only get two 

// gridlines in x axis function
function make_x_gridlines() {return d3.axisBottom(xScale)};
// gridlines in y axis function
function make_y_gridlines() {return d3.axisLeft(yScale)};

// append all the axes plus gridlines to the svg 
svg.append("g") //start with the xaxis
.attr("transform", `translate(${left_margin}, ${candle_win_height+top_margin})`) //x-axis ie date
.call(xAxis);

svg.append("g")	 //append gridlines to x-axis v4 D3 		
.attr("class", "grid")
.attr("transform", `translate(${left_margin}, ${top_margin})`)
.style("stroke", "grey")
.style("stroke-width", "1")
.style("opacity", "0.1")
.style("shape-rendering", "crispEdges") 
.call(make_x_gridlines()
    .tickSize(+(candle_win_height+indicator_win_height))
    .tickFormat("")
)

svg.append("g")	 //append gridlines to y-axis v4 D3 		
.attr("class", "grid")
.attr("transform", `translate(${left_margin+candle_win_width}, ${top_margin})`)
.style("stroke", "grey")
.style("stroke-width", "1")
.style("opacity", "0.1")
.style("shape-rendering", "crispEdges") 
.call(make_y_gridlines()
    .tickSize(+candle_win_width)
    .tickFormat("")
)

svg.append("g")
.attr("transform", `translate(${left_margin}, ${top_margin})`) // main price axis 
.style("font", "12px sans-serif")
.style("stroke", "grey")
.call(yAxis);

svg.append("g")
.attr("transform", `translate(${left_margin+candle_win_width}, ${(1-volume_win_ratio)*candle_win_height+top_margin})`) //volume axis, right side 
.style("font", "12px sans-serif")
.style("stroke", "grey")
.call(yAxis2);

svg.append("g")
.attr("transform", `translate(${left_margin}, ${candle_win_height+top_margin})`) //indicator_1 axis left side
.attr("font-family", "sans-serif")
.style("font", "12px sans-serif")
.style("stroke", "blue")
.call(yAxis3);

svg.append("g")//indicator_2 axis right side
.attr("transform", `translate(${left_margin+candle_win_width}, ${candle_win_height+top_margin})`) //indicator_2 axis right side
.attr("font-family", "sans-serif")
.style("font", "12px sans-serif")
.style("stroke", "green")
.call(yAxis4);

for (i = 1; i < volume.length; i++) {  // main loop to create each chart item 
  var bar_height = volume[i]/max_volume*vol_max_height; 
  if (close[i]<close[i-1]) {bar_color="red"} // to make rising canldes/bars green and falling red 
    else {bar_color="green";
  } 
  if (open[i] < close[i]) {
    candle_y_start = open[i];  
    var candle_height = close[i]-open[i];
  }
    else {
      candle_y_start = close[i];
      var candle_height = open[i]-close[i];
  }

  svg.append("line") // now lets do the wicks of the candlesticks ** THE WICKS **
  .attr("x1", bar_width*i+left_margin)
  .attr("x2", bar_width*i+left_margin) //it's a vertical wick so same as above 
  .attr("y1", candlestick_max_height-(high[i]-lowest_wick)*scaler+top_margin) //top of wick 
  .attr("y2", candlestick_max_height-(low[i]-lowest_wick)*scaler+top_margin) //bottom of wick
  .style("stroke", bar_color)
  .style("stroke-width", "2")
  .style("fill", "none");

  svg.append("line") // ********************************LINE for indicator ONE  *********
  .attr("x1", bar_width*(i-1)+left_margin) //previous line x pos 
  .attr("x2", bar_width*i+left_margin) // current line xpos
  .attr("y1", indicator_win_height+candle_win_height-(indicator_1[i-1]-min_i1)*i1_scaler+top_margin) //y pos for previous 
  .attr("y2", indicator_win_height+candle_win_height-(indicator_1[i]-min_i1)*i1_scaler+top_margin) // y pos for current 
  .style("stroke", "blue")
  .style("stroke-width", "2")
  .style("fill", "none");

  svg.append("line") // ********************************LINE for indicator TWO  *********
  .attr("x1", bar_width*(i-1)+left_margin) //previous line x pos 
  .attr("x2", bar_width*i+left_margin) // current line xpos
  .attr("y1", (top_margin+candle_win_height+indicator_win_height)-((indicator_2[i-1]-min_i2)*i2_scaler)) //y pos for previous 
  .attr("y2", (top_margin+candle_win_height+indicator_win_height)-((indicator_2[i]-min_i2)*i2_scaler)) // y pos for current 
  .style("stroke", "green ")
  .style("stroke-width", "2")
  .style("fill", "none");
console.log("(indicator_2[i]*i2_scaler)",(indicator_2[i]*i2_scaler));
 
  svg.append("rect")  // candlesticks  *** CANDLE BODY *** 
    .attr("width", bar_width*.94) 
    .attr("height", candle_height*scaler) // calculated above 
    .attr("x", bar_width*(i-1)+(.5*bar_width)+left_margin) //x location so width of bar * iterator  
    .attr("y", candlestick_max_height-(candle_y_start-lowest_wick)*scaler+top_margin-candle_height*scaler) //y location
    .attr("rx", "3") // for the rounded corners   
    .attr("ry", "3") // for the rounded corners    
    .style("stroke", "black") // works 
    .style("stroke-width", 2) // works 
    .style("opacity", 1) // works 
    .style("fill", bar_color); //works and use "none" instead of false 
  
  svg.append("rect")  //then let us do our ** VOLUME BARS **
    .attr("width", bar_width*.99) 
    .attr("height", bar_height) // calculated above 
    .attr("x", bar_width*(i-1)+(.5*bar_width)+left_margin) //x location so width of bar * iterator  
    .attr("y", vol_base-bar_height+top_margin) //y location
    .style("stroke", "black") // works 
    .style("stroke-width", 2) // works 
    .style("opacity", .6) // works 
    .style("fill", bar_color); //works and use "none" instead of false 
}
}) 
    /* D3 ParseDate abbreviations reference
    %a - abbreviated weekday name.
    %A - full weekday name.
    %b - abbreviated month name.
    %B - full month name.
    %c - date and time, as "%a %b %e %H:%M:%S %Y".
    %d - zero-padded day of the month as a decimal number [01,31].
    %e - space-padded day of the month as a decimal number [ 1,31].
    %H - hour (24-hour clock) as a decimal number [00,23].
    %I - hour (12-hour clock) as a decimal number [01,12].
    %j - day of the year as a decimal number [001,366].
    %m - month as a decimal number [01,12].
    %M - minute as a decimal number [00,59].
    %p - either AM or PM.
    %S - second as a decimal number [00,61].
    %U - week number of the year (Sunday as the first day of the week) as a decimal number [00,53].
    %w - weekday as a decimal number [0(Sunday),6].
    %W - week number of the year (Monday as the first day of the week) as a decimal number [00,53].
    %x - date, as "%m/%d/%y".
    %X - time, as "%H:%M:%S".
    %y - year without century as a decimal number [00,99].
    %Y - year with century as a decimal number.
    %Z - time zone offset, such as "-0700".
    %% - a literal "%" character
    */