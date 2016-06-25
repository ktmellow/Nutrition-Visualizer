// Dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const request = require('request');

//  Using dotenv to keep my API key a secret
if(process.env.NODE_ENV !== "production"){
    var api_key = require('dotenv').load().SECRET;
}

// Middleware
app.use(bodyParser.json({type:"application/json"}));
app.use(methodOverride('_method'));
app.use('/client', express.static('client'));


// Routes
app.get("/foodData", function(req, res) {
  var sample_url = 'http://api.nal.usda.gov/ndb/reports/?ndbno=01009&type=f&format=json&api_key=';
  request({
    url: sample_url + api_key,
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}, function(error, response, body) {
    parsed_body = JSON.parse(body)
    res.format({
      json: function() {
        res.json({body})
      }
    })
  })
});


app.get("/", function(req, res) {
  res.sendFile(__dirname + '/client/views/layout.html');
});

app.listen(3000, function() {
  console.log("Server is listening on port 3000...");
});