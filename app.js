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
// TO DO: Refactor /food/data
// Use helper functions for requests

app.get("/food/suggest", function(req, res) {
  var query = encodeURIComponent(req.query.q);
  var search_url= `http://api.nal.usda.gov/ndb/search/?format=json&q=${query}&sort=n&max=10&offset=0&api_key=${api_key}`;
  request({
    url: search_url,
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
  }, function(error, response, body) {
    var parsed_body = JSON.parse(body);
    res.format({
      json: function() {
        res.json({parsed_body})
      }
    })
  });
})

app.get("/food/data/", function(req, res) {
  var id = req.query.id;
  var food_url = `http://api.nal.usda.gov/ndb/reports/?ndbno=${id}&type=f&format=json&api_key=${api_key}`;
  request({
    url: food_url,
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}, function(error, response, body) {
    var parsed_body = JSON.parse(body);
        console.log(parsed_body, body)

    res.format({
      json: function() {
        res.json({parsed_body})
      }
    })
  })
});

// Landing page
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/client/views/layout.html');
});

app.listen(3000, function() {
  console.log("Server is listening on port 3000...");
});