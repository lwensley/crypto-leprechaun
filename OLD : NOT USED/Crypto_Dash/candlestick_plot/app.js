//chart variables
var dates=[]; 
var openingPrices=[]; 
var highPrices=[]; 
var lowPrices=[];
var closingPrices=[];
//var unit_volume=[];
var new_dates=[];
var unit_volume=[15,25,30,35,75];


// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
// python -m http.server
//d3.csv("hours-of-tv-watched.csv", function(error, tvData) {
d3.csv("3Y_BTC_5-15-19.csv", function(error, data) { //here's my CSV file with ~10 columns 
  // Log an error if one exists
  if (error) return console.warn(error);
  // Print the tvData
  
  data.forEach(function(ddd) {  // each ddd is an object that is one row of data from the CSV
    var new_data=Object.values(ddd); //transform object into an array 
    var formattedDate = new_data[1].slice(0, 4) + "-" + new_data[1].slice(4, 6) + "-" + new_data[1].slice(6, 8); // changes from YYYYMMDD to YYYY-MM-DD for plotyly
    
    dates.push(formattedDate); //push to dates array
    openingPrices.push(+new_data[2]);//open  
    highPrices.push(+new_data[3]);//high
    lowPrices.push(+new_data[4]);//low 
    closingPrices.push(+new_data[5]);//close
    //unit_volume.push(+new_data[7])//$ volume 
    
  });
  new_dates=Object.values(dates); //transform object into an array 
  console.log("typeof new dates: ",typeof(new_dates), " new dates [0]", new_dates[0]);

  var barSpacing = 1; // desired space between each bar
  var scaleY = 10; // 10x scale on rect height

  // @TODO
  // Create a 'barWidth' variable so that the bar chart spans the entire chartWidth.
  var barWidth = (chartWidth - (barSpacing * (unit_volume.length - 1))) / unit_volume.length;
 
  var max_volume = Math.max.apply(0, unit_volume);
 
  console.log(unit_volume);
  // Create code to build the bar chart using the tvData.
  chartGroup.selectAll(".bar")
    .data(unit_volume)
    .enter()
    .append("rect")
    .classed("bar", true)
    .attr("width", d => barWidth) // width of bar
    .attr("height", d => d * scaleY) // max height of bar
    .attr("x", (d, i) => i * (barWidth + barSpacing)) // d is the iteration, and i is the count 
    .attr("y", d => chartHeight - unit_volume * scaleY); // y series 
    // chartheight is 

    // y-axis example 
  svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("class", "label")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Protein (g)");
});
