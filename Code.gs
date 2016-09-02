function checkSurf() {

  var NOTIFICATION_RATING_THRESHOLD = 3;  //Number 1 - 5
  var MSW_API_KEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";  //Sign up for api key here http://magicseaweed.com/developer/api
  var MSW_SPOT_ID = "32";  //Navigate to spot on magicseaweed.com and find id in the url. Example spot id 32 is from http://magicseaweed.com/Llangennith-Rhossili-Surf-Report/32/
  var LOCAL_TIMEZONE = "BST";
  var TIME_FORMAT = "dd-MM hh:mm";
  var message = "";
  var url = 'http://magicseaweed.com/api/' + MSW_API_KEY + '/forecast/?spot_id=' + MSW_SPOT_ID;
  var sendNotification = false;
  
  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();
  var data = JSON.parse(json);
  
  //loop through forecasts
  for (i in data) {
        
    //Build message for any forecast period which is greater than notification threshold, you could add other criteria here
    if (data[i].solidRating >= NOTIFICATION_RATING_THRESHOLD) {
      startDate = new Date(data[i].localTimestamp * 1000);
    
      //Build any message you want
      message = message + "\n" + Utilities.formatDate(startDate, LOCAL_TIMEZONE, TIME_FORMAT) + ": " + data[i].solidRating + " star surf dude!!";
      sendNotification = true;
      
    }
    
  }
  
  //If any notifications then send to slack
  if (sendNotification) {
      sendToSlack(message);
      
  }
  
}

//Copied this from https://gist.github.com/codeas/1fd5697037bc5ebb2b31#file-gas2slack_webhook-js
function sendToSlack(payload) {

  var url = "https://hooks.slack.com/services/xxxxxx/xxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxxxx";  //In slack add a webhook to a channel and copy the url here
  
  var payload = {
     //"channel" : "#test", // <-- optional parameter, use if you want to override default channel
     "username" : "surfbot", // <-- optional parameter, use if you want to override default "robot" name 
     "text" : payload, // <-- required parameter
     "icon_emoji": ":surfer:", // <-- optional parameter, use if you want to override default icon, 
     //"icon_url" : "http://image" // <-- optional parameter, use if you want to override default icon
  }
 
   var options =  {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : JSON.stringify(payload)
  };
  
  return UrlFetchApp.fetch(url, options)
}
