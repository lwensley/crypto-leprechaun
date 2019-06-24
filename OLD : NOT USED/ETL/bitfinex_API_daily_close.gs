function callNumbers() {
// Create a date object for the current date and time.
var now = new Date();
Logger.log(now)
var hours = now.getHours();
var minutes = now.getMinutes();
var seconds = now.getSeconds();
 
Logger.log(hours)
Logger.log(minutes)
Logger.log(seconds)

//new candles at midnight UTC (5 PM PST)
//start with shorts 
var response = UrlFetchApp.fetch("https://api-pub.bitfinex.com/v2/stats1/pos.size:1m:tBTCUSD:short/last");
Logger.log(response.getContentText());
shorts_string=String(response);
var shorts = shorts_string.split(",");
shorts[1]=shorts[1].replace(']','')
Logger.log(shorts[1]) // THIS IS THE ONE WE WANT, shorts

//now do longs
var response = UrlFetchApp.fetch("https://api-pub.bitfinex.com/v2/stats1/pos.size:1m:tBTCUSD:long/last");
Logger.log(response.getContentText());
longs_string=String(response);
var longs = longs_string.split(",");
longs[1]=longs[1].replace(']','')
Logger.log(longs[1]) // THIS IS THE ONE WE WANT, longs

//finally volume
var response = UrlFetchApp.fetch("https://api.bitfinex.com/v1/stats/btcusd");
Logger.log(response.getContentText());
volume_string=String(response);
var volume=volume_string.split(":");
volume_string=volume[2].split("{");
Logger.log("next is volumen_string");
Logger.log(volume_string[0]);
volume_string[0] = volume_string[0].replace('"','')
volume_string[0] = volume_string[0].replace('}','')
volume_string[0] = volume_string[0].replace(',','')
volume_string[0] = volume_string[0].replace('"','')
Logger.log(volume_string[0]);

var sheet = SpreadsheetApp.getActiveSheet();
sheet.appendRow([now, shorts[1], longs[1], volume_string[0]]);
   
//sheet.getRange(day,1).setValue([now]);
//sheet.getRange(day,2).setValue([shorts[1]]);
//sheet.getRange(day,3).setValue([longs[1]]);
  