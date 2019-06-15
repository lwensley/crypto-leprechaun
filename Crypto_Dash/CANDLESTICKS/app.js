var high = [55,46,66,63,45,46,66,65,65,65,40,40]; //peaks at 62 
var low =  [35, 1,25,20,35,34,60,4,3,32,12,20]; 
var open = [50,35,59,55,40,45,61,7,7,54,13,25]; 
var close= [35,45,65,40,30,40,62,15,10,65,65,35]; // need to have one extra in beginning that won't show to determine bar colors so always start at [1] 

var volume= [10,15,29,50,5,7,15,25,27,12,15,35];
const window_height = 490;
const window_width = 950;
const left_margin = 25;
const top_margin = 10;
console.log(open.length, high.length, low.length, close.length, volume.length);

// Append the SVG cointainer, set its height and width, and create a variable which references it
var svg = d3.select("#svg-area") //1000 width and 500 heihgt good on my laptop
  .append("svg")
  .attr("height", "500")
  .attr("width", "1000"); // ; only for the last one, no , either

// Append a rectangle and set its height in relation to the booksReadThisYear value

svg.append("rect")
  .attr("width", window_width)
  .attr("height", window_height)
  .attr("x", left_margin) //x location   
  .attr("y", top_margin) //y location
  //.attr("color", "green")
  .style("stroke", "grey") // works 
  .style("stroke-width", 3) // works 
  .style("opacity", 1) // works 
  .style("fill", "none"); //works and use "none" instead of false 

  /* below is to append text
  holder.append("text")            // append text
    .style("fill", "black")      // make the text black
    .style("writing-mode", "tb") // set the writing mode
    .attr("x", 200)         // set x position of left side of text
    .attr("y", 100)         // set y position of bottom of text
    .text("Hello World");   // define the text to display
*/
//variables for volume and candlestick size setup 
var max_volume = Math.max.apply(0, volume);
const vol_max_height = 1/5*window_height;
const vol_base=window_height;  
var bar_width = window_width/volume.length 

const candlestick__max_height = 4/5*window_height-top_margin; //for the wicks gives us a 382 range  
var highest_wick = Math.max.apply(0, high); // 
var lowest_wick = Math.min.apply(0, low); // 
const scaler = candlestick__max_height / (highest_wick-lowest_wick) //this one too high 

console.log(scaler);
console.log("high wick", highest_wick);
console.log("low wick", lowest_wick);

for (i = 1; i < volume.length; i++) {  // loop to do the charts 
  var bar_height = volume[i]/max_volume*vol_max_height; 
  
  if (close[i]<close[i-1]) {bar_color="red"} 
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
  .attr("x1", bar_width*i)
  .attr("x2", bar_width*i)
  .attr("y1", candlestick__max_height-(high[i]-lowest_wick)*scaler+top_margin)  // 
  .attr("y2", candlestick__max_height-(low[i]-lowest_wick)*scaler+top_margin)
  .style("stroke", bar_color)
  .style("stroke-width", "2")
  .style("fill", "none");
  console.log("i:",i," candle y start:", candle_y_start, " candle height:", candle_height);
  //console.log("calc for y", candlestick__max_height-high[i]*scaler);

  svg.append("rect")  // candlesticks  *** CANDLE BODY *** 
    .attr("width", bar_width*.94) 
    .attr("height", candle_height*scaler) // calculated above 
    .attr("x", bar_width*(i-1)+(.5*bar_width)) //x location so width of bar * iterator  
    .attr("y", candlestick__max_height-(candle_y_start-lowest_wick)*scaler+top_margin-candle_height*scaler) //y location
    .style("stroke", "grey") // works 
    .style("stroke-width", 2) // works 
    .style("opacity", 1) // works 
    .style("fill", bar_color); //works and use "none" instead of false 
  
  svg.append("rect")  //then let us do our ** VOLUME BARS **
    .attr("width", bar_width) 
    .attr("height", bar_height) // calculated above 
    .attr("x", bar_width*(i-1)+(.5*bar_width)) //x location so width of bar * iterator  
    .attr("y", vol_base-bar_height+top_margin) //y location
    .style("stroke", "black") // works 
    .style("stroke-width", 2) // works 
    .style("opacity", .8) // works 
    .style("fill", bar_color); //works and use "none" instead of false 
}


