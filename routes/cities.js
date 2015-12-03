var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var db = require('monk')(process.env. || 'localhost/project2');

var yelp = require("node-yelp");
var unirest = require('unirest')


router.get('/', function (req, res, next) {
  	res.render('cities/index', {user: req.session.user});
});

router.post('/', function(req, res, next) {
	var errors = [];
	if(!req.body.city.trim()){
		errors.push('City cannot be blank')
	}
	if(!req.body.state.trim()){
		errors.push('State must be selected.')
	}
	if(errors.length == 0) {
		var city = req.body.city;
	 	var state = req.body.state;
  res.redirect('cities/' + city + '/' + state);
} else {
	res.render('cities/index', {errors: errors, user: req.session.user})
}
});

	
router.get('/:city/:state', function (req, res, next){
	var forecasts;
	unirest.get('http://api.wunderground.com/api/62db039518025c86/forecast10day/q/' + req.params.state + '/' + req.params.city +'.json')
      .end(function (response) {
      forecasts = response.body.forecast.txt_forecast.forecastday
      })

	var client = yelp.createClient({
  oauth: {
    "consumer_key": process.env.oauth_consumer_key,
    "consumer_secret": process.env.oauth_consumer_secret,
    "token": process.env.oauth_token,
    "token_secret": process.env.oauth_token_secret
  },
  
  // Optional settings: 
  httpClient: {
    maxSockets: 25  // ~> Default is 10 
  }
});

client.search({
  terms: "outdoors",
  category_filter: "active",
  location: req.params.city + "," + req.params.state,
  limit: 10
}).then(function (data) {
	var attractions = data.businesses;
		res.render('cities/show', {
			forecasts: forecasts,
			attractions: attractions,
			city: req.params.city,
			state: req.params.state,
			user: req.session.user
		});
		});
});



module.exports = router;