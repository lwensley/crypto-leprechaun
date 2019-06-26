function makeResponsive() {

  //constants - mostly for sizing 
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight; 


  var margin = {
    top: 50,
    right: 150,
    bottom: 30,
    left: 150
  };


  var candle_win_height = (window.innerHeight - margin.bottom - margin.top) * 4/5;
  var candle_win_width = window.innerWidth - margin.left - margin.right; //size of the candlestick and volume rect 
  var indicator_win_height = (window.innerHeight - margin.bottom - margin.top) * 1/5;; //size of indicator rect 
  var indicator_win_width = candle_win_width; //size of indicator rect 


  const candle_win_ratio = 4/5;
  const volume_win_ratio = 1/4;

  // // global variable declarations 
  // var low=[];
  // var open=[];
  // var high=[];
  // var low=[];
  // var close=[];
  // var volume=[];
  // var date=[];
  // var finex_shorts=[]; 
  // var finex_leveraged_longs = [];
  // var finex_unit_volume = [];
  // var bitcoin_dominance =[];

  // Parse the date / time
  var parseDate = d3.timeParse("%e %b %y"); // this is D3v4 version, hopefully works 

  // clear if svg is not empty --> required for "make responsive"
  var svgArea = d3.select("#svg-area").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
    }

  // Append the SVG cointainer, set its height and width, and create a variable which references it  
  var svg = d3
    .select("#svg-area") 
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth); 

  // // Append an SVG group
  // var chartGroup = svg.append("g")
  //     .attr("transform", `translate(${margin.left}, ${margin.top})`);  


  // function used for updating indicator scale var upon click on indicator axis label
  function iScale(data, chosenIaxis, indicator_win_height) {
   
    // create scales
    var iLinearScale = d3.scaleLinear()
      // .domain([d3.max(data, d => d[chosenIaxis]), d3.min(data, d => d[chosenIaxis])])
      // .range([0, (indicator_win_height)]);
 
      .domain([d3.max(chosenIaxis), d3.min(chosenIaxis)])
      .range([0, (indicator_win_height)]); //

      return iLinearScale;

    }

  // function used for updating Indicator Axis var upon click on axis label
  function renderIaxis(newIScale, iAxis) {
    var leftiAxis = d3.axisLeft(newIScale)
      .ticks(6);

    iAxis
    // iAxis.transition()
    //   .duration(1000)
      .call(leftiAxis);

    return iAxis;
    }

  // function used for updating lines group with a transition to new lines
  
  // function renderLines(iLinesGroup, newIScale, chosenIaxis)  --------> IS THIS AN ISSUE???
  function renderLines(iLinesGroup, chosenIaxis, bar_width, i, min_i, i_scaler) {

    iLinesGroup
      // .transition()
      // .duration(1000)
      .attr("x1", bar_width * (i-1)+margin.left) //previous line x pos 
      .attr("x2", bar_width * i+margin.left) // current line xpos
      .attr("y1", indicator_win_height+candle_win_height-(chosenIaxis[i-1]-min_i)*i_scaler+margin.top) //y pos for previous 
      .attr("y2", indicator_win_height+candle_win_height-(chosenIaxis[i]-min_i)*i_scaler+margin.top) // y pos for current 

    return iLinesGroup;
  }


  // function used for updating indicator group with new tooltip
  function updateToolTip(chosenIaxis, iLinesGroup) {

    if (chosenIaxis === finex_shorts) {
      var labeli = "Shorts: ";
    }

    else {
      var labeli = "Dominance: ";
    }

    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([0, 0])
      .html(function(d) { 
        // console.log(d)
        return (`${d.date}<br>${labeli} ${d[chosenIaxis]}<br>${labeli} ${d[chosenIaxis]}`);
      });

    iLinesGroup.call(toolTip);

    iLinesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    return iLinesGroup;
  }




  // get data from CSV and parse the date 
  d3.csv("7mos_test_data.csv").then( function(data)  {
    
    var low=[];
    var open=[];
    var high=[];
    var low=[];
    var close=[];
    var volume=[];

    var finex_shorts=[]; 
    var finex_leveraged_longs=[];
    var finex_unit_volume=[];
    var bitcoin_dominance=[];
    var bitmex_funding=[]

    data.forEach(function(d) {
      //console.log(d);
      low.push(+d.Low);
      close.push(+d.Close);
      open.push(+d.Open);
      high.push(+d.High);
      volume.push(+d.UnitVolume/1000);
      finex_leveraged_longs.push(+d.bitfinex_longs);
      finex_shorts.push(+d.bitfinex_shorts);
      bitcoin_dominance.push(+d.bitcoin_dominance);
      // bitmex_funding.push(+d.bitmex_funding);
      // d.bitfinex_longs = +d.bitfinex_longs;
      // d.bitfinex_shorts = +data.bitfinex_shorts;
      // d.bitcoin_dominance = +data.bitcoin_dominance;
      // d.date = d.Date; // I should have ParseDate here but then nothing shows on x-axis 
      var year = d.Date.slice(0,4);
      var month = d.Date.slice(4,6)+'-';
      var day = d.Date.slice(6,8)+'-';

      date = []

      date.push(day.concat(month.concat(year))); // I should have ParseDate here but then nothing shows on x-axis 

    });
  
    //variables for volume and candlestick size setup 
    var max_volume = Math.max.apply(0, volume);
    const vol_max_height = volume_win_ratio * candle_win_height;
    const vol_base=candle_win_height;  
    var bar_width = candle_win_width/volume.length;
    const candlestick_max_height = candle_win_ratio * candle_win_height - margin.top; //for the wicks gives us a 382 range  
    var highest_wick = Math.max.apply(0, high); // 
    var lowest_wick = d3.min(low); // 
    const scaler = candlestick_max_height / (highest_wick-lowest_wick); //scaler for candlestick window 

    var chosenIaxis = finex_shorts;

    // X-AXIS ***********????

    // set x-scale
    var xScale = d3.scaleTime()//scaleBand()
      .domain([d3.min(date), d3.max(date)]) // need to parse the date I think  
      .range([0, candle_win_width]);
    
    // create x-axis
    var xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.timeFormat("%e %b %y"))// d3 v4 
      .ticks(12); // this one is not working, I only get two 

    // add x-axis to svg
    svg.append("g") 
      .attr("transform", `translate(${margin.left}, ${candle_win_height+margin.top})`) //x-axis ie date
      .call(xAxis);


    // CANDLE Y-AXIS

    // set y-scale for the candles
    var yScale = d3.scaleLinear()
      .domain([d3.max(high), d3.min(low)])
      .range([0, candle_win_ratio*candle_win_height]);
    
    // create candle y-axis
    var yAxis = d3.axisLeft(yScale) //candlestick y axis 
      .ticks(10); 

    // add candle y-axis to svg
    svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`) // main price axis 
      .style("font", "12px sans-serif")
      .style("stroke", "grey")
      .call(yAxis)



    // TRADING VOLUME Y-AXIS

    // set y-scale for trading volume
    var yScale2 = d3.scaleLinear() 
      .domain([d3.max(volume), 0])
      .range([0, volume_win_ratio*candle_win_height]);
    
    // create trading volume y-axis
    var yAxis2 = d3.axisRight(yScale2) // volume y axis
      .ticks(5);

    // add trading volume y-axis to svg
    svg.append("g")
      .attr("transform", `translate(${margin.left+candle_win_width}, ${(1-volume_win_ratio)*candle_win_height+margin.top})`) //volume axis, right side 
      .style("font", "12px sans-serif")
      .style("stroke", "grey")
      .call(yAxis2);

      

    // CREATE INDICATOR Y-AXIS

    // set y-scale for indicator by calling indicator scale function "iScale"
    var iLinearScale = iScale(data, chosenIaxis, indicator_win_height);
    
    // create indicator y-axis
    var iAxis = d3.axisLeft(iLinearScale)
      .ticks(6);
    // // updates i axis with transition
    
    // iAxis = renderIaxis(iLinearScale, iAxis)

   // append indicator y axis
    svg.append("g")
      .classed("y-axis", true)
      .attr("transform", `translate(${margin.left}, ${candle_win_height+margin.top})`)
      .call(iAxis);


    // // append indicator y axis
    // var iAxis = svg.append("g")
    //     .classed("y-axis", true)
    //     .attr("transform", `translate(0, ${indicator_win_height})`)
    //     .call(leftiAxis);

    // // updates i axis with transition
    // iAxis = renderIaxis(iLinearScale, iAxis);


    // GRIDLINES

    // gridlines in x axis function
    function make_x_gridlines() {return d3.axisBottom(xScale)};

    // gridlines in y axis function
    function make_y_gridlines() {return d3.axisLeft(yScale)};

    // X-Axis gridlines
    svg.append("g")			
     .attr("class", "grid")
     .attr("transform", `translate(${margin.left}, ${margin.top})`)
     .style("stroke", "grey")
     .style("stroke-width", "1")
     .style("opacity", "0.1")
     .style("shape-rendering", "crispEdges") 
     .call(make_x_gridlines()
        .tickSize(+(candle_win_height+indicator_win_height))
        .tickFormat("")
    )

    // Y-Axis gridlines
    svg.append("g")	 //append gridlines to y-axis v4 D3 		
     .attr("class", "grid")
     .attr("transform", `translate(${margin.left+candle_win_width}, ${margin.top})`)
     .style("stroke", "grey")
     .style("stroke-width", "1")
     .style("opacity", "0.1")
     .style("shape-rendering", "crispEdges") 
     .call(make_y_gridlines()
        .tickSize(+candle_win_width)
        .tickFormat("")
    )

    // CHART BOARDERS

    // Append one rectangle for the candlesticks and the volume charts 
    svg.append("rect")
      .attr("width", candle_win_width)
      .attr("height", candle_win_height)
      .attr("x", margin.left) //x location   
      .attr("y", margin.top) //y location
      //.attr("color", "green")
      .style("stroke", "grey") // works 
      .style("stroke-width", 2) // works 
      .style("opacity", 1) // works 
      .style("fill", "none"); //works and use "none" instead of false 
      
    // second rectangle below for the sentiment indicators
    svg.append("rect") // second rectangle below for the sentiment indicators 
      .attr("width", indicator_win_width)
      .attr("height" ,indicator_win_height)
      .attr("x", margin.left) //x location   
      .attr("y", margin.top+candle_win_height) //y location
      //.attr("color", "green")
      .style("stroke", "grey") // works 
      .style("stroke-width", 2) // works 
      .style("opacity", 1) // works 
      .style("fill", "none"); //works and use "none" instead of false 


    // INDICATOR LABLES

    // Create group for  3 i-axis labels 
    var ilabelsGroup = svg.append("g")
          .attr("font-family", "sans-serif")
          .style("font", "12px sans-serif")

    var indicator_1_label = ilabelsGroup.append("g")
      .attr("transform", `translate(${margin.left}, ${candle_win_height+margin.top})`) //indicator_1 axis left side
      .style("stroke", "blue")
      .attr("value", finex_shorts)
      .attr("x", 100)         // set x position of left side of text
      .attr("y", (candle_win_height + indicator_win_height + margin.top+15)) // set y position of bottom of text
      .classed("active", true)
      .text("Biftinex Short Contracts")

    var indicator_2_label = ilabelsGroup.append("g")//indicator_2 axis right side
      .attr("transform", `translate(${margin.left+candle_win_width}, ${candle_win_height+margin.top})`) //indicator_2 axis right side
      .style("stroke", "green")
      .attr("value", bitcoin_dominance)
      .attr("x", candle_win_width - 150)         // set x position of left side of text
      .attr("y", (candle_win_height + indicator_win_height + margin.top+15)) // set y position of bottom of text
      .classed("inactive", true)
      .text("Bitcoin Dominance (% of total cap)");

      
    // // Append indicator labels to chart
    // svg.append("text")            // append text
    //   .style("fill", "blue")      // make the text black
    //   .attr("x", 100)         // set x position of left side of text
    //   .attr("y", (candle_win_height + indicator_win_height + margin.top+15)) // set y position of bottom of text
    //   .text(indicator_1_label);   // define the text to display

    // svg.append("text")            // append text
    //   .style("fill", "blue")      // make the text black
    //   .attr("x", candle_win_width - 150)         // set x position of left side of text
    //   .attr("y", (candle_win_height + indicator_win_height + margin.top+15)) // set y position of bottom of text
    //   .text(indicator_2_label);   // define the text to display


    // CANDLE BARS, CANDLE WICKS AND INDICATOR LINES

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

      // CREATE WICKS
      svg.append("line") // now lets do the wicks of the candlesticks ** THE WICKS **
        .attr("x1", bar_width*i+margin.left)
        .attr("x2", bar_width*i+margin.left) //it's a vertical wick so same as above 
        .attr("y1", candlestick_max_height-(high[i]-lowest_wick)*scaler+margin.top) //top of wick 
        .attr("y2", candlestick_max_height-(low[i]-lowest_wick)*scaler+margin.top) //bottom of wick
        .style("stroke", bar_color)
        .style("stroke-width", "2")
        .style("fill", "none");


      // CREATE BODY
      svg.append("rect")  // candlesticks  *** CANDLE BODY *** 
        .attr("width", bar_width*.94) 
        .attr("height", candle_height*scaler) // calculated above 
        .attr("x", bar_width*(i-1)+(.5*bar_width)+margin.left) //x location so width of bar * iterator  
        .attr("y", candlestick_max_height-(candle_y_start-lowest_wick)*scaler+margin.top-candle_height*scaler) //y location
        .attr("rx", "3") // for the rounded corners   
        .attr("ry", "3") // for the rounded corners    
        .style("stroke", "black") // works 
        .style("stroke-width", 2) // works 
        .style("opacity", 1) // works 
        .style("fill", bar_color); //works and use "none" instead of false 
    

      // CREATE VOLUME BARS
      svg.append("rect")  //then let us do our ** VOLUME BARS **
        .attr("width", bar_width*.99) 
        .attr("height", bar_height) // calculated above 
        .attr("x", bar_width*(i-1)+(.5*bar_width)+margin.left) //x location so width of bar * iterator  
        .attr("y", vol_base-bar_height+margin.top) //y location
        .style("stroke", "black") // works 
        .style("stroke-width", 2) // works 
        .style("opacity", .6) // works 
        .style("fill", bar_color); //works and use "none" instead of false

      // CREATE VOLUME BARS
      
      const max_i = d3.max(chosenIaxis);
      const min_i = d3.min(chosenIaxis);
      const i_scaler =(indicator_win_height)/(max_i-min_i); //scaler for indicator 1

      var iLinesGroup = svg.append("line") // ********************************LINE for indicator ONE  *********
        .attr("x1", bar_width*(i-1)+margin.left) //previous line x pos 
        .attr("x2", bar_width*i+margin.left) // current line xpos
        .attr("y1", indicator_win_height+candle_win_height-(chosenIaxis[i-1]-min_i)*i_scaler+margin.top) //y pos for previous 
        .attr("y2", indicator_win_height+candle_win_height-(chosenIaxis[i]-min_i)*i_scaler+margin.top) // y pos for current 
        .style("stroke", "blue")
        .style("stroke-width", "2")
        .style("fill", "none");

      // updates circles with new x values
      iLinesGroup = renderLines(iLinesGroup, chosenIaxis, bar_width, i, min_i, i_scaler);
      
    }


    // INDICATOR EVENT LISTENER
    ilabelsGroup.selectAll("text")
      .on("click", function() {
      // get value of selection
      var valuei = d3.select(this).attr("value");
      if (valuei !== chosenIaxis) {

        // replaces chosenIxis with value
        chosenIaxis = valuei;



        //       // CREASE INDICATOR Y-AXIS

        //         // set y-scale for indicator by calling indicator scale function "iScale"
        //         var iLinearScale = iScale(data, chosenIaxis);

        //         // Create indicator y-axis
        //         var leftiAxis = d3.axisLeft(iLinearScale)
        //           .ticks(6);

        //         /// CHARTGROUP???
        //         // append y axis
        //         var iAxis = svg.append("g")
        //           .classed("y-axis", true)
        //           .attr("transform", `translate(0, ${height})`)
        //           .call(leftiAxis);

        //         // updates i axis with transition
        //         iAxis = renderIaxis(iLinearScale, iAxis);

        //       // CREASE INDICATOR Y-AXIS







          // // updateToolTip function above csv import
          // var iLinesGroup = updateToolTip(chosenIaxis, iLinesGroup);



          //       var iLinesGroup = svg.append("line") // ********************************LINE for indicator ONE  *********
          //       .attr("x1", bar_width*(i-1)+margin.left) //previous line x pos 
          //       .attr("x2", bar_width*i+margin.left) // current line xpos
          //       .attr("y1", indicator_win_height+candle_win_height-(chosenIaxis[i-1]-min_i)*i_scaler+margin.top) //y pos for previous 
          //       .attr("y2", indicator_win_height+candle_win_height-(chosenIaxis[i]-min_i)*i_scaler+margin.top) // y pos for current 
          //       .style("stroke", "blue")
          //       .style("stroke-width", "2")
          //       .style("fill", "none");








    
        //     // functions here found above csv import
        //     // updates i scale for new data
        //     iLinearScale = iScale(data, chosenIaxis);

        //     // updates i axis with transition
        //     iAxis = renderIaxis(iLinearScale, iAxis);

        //     // updates circles with new x values
        //     iLinesGroup = renderLines(iLinesGroup, iLinearScale, chosenIaxis);

        //     // // updates states with new x values
        //     // stateGroup = renderState(stateGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //     // updates tooltips with new info
        //     iLinesGroup = updateToolTip(chosenIaxis, iLinesGroupp);








        // changes classes to change bold text
        if (chosenIaxis === finex_shorts) {
        indicator_1_label
            .classed("active", true)
            .classed("inactive", false);
        indicator_2_label
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
        indicator_1_label
            .classed("active", false)
            .classed("inactive", true);
        indicator_2_label
            .classed("active", true)
            .classed("inactive", false);
        }
  



      }})
  })

};

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);