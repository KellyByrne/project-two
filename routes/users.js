var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('monk')('localhost/project2');
var Users = db.get('Users');

/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render('users/signup');
});

router.post('/signup', function(req, res, next){
	var errors = [];
	if(!req.body.name.trim()) {
		errors.push("Name is required.")
	}
	if(!req.body.email.trim()) {
		errors.push("Email is required.")
	}
	if(!req.body.password.trim()){
		errors.push("Password is required.")
	}
	if(req.body.password.length < 8){
		errors.push("Password must be greater than 8 characters.")
	}

	Users.findOne({email: req.body.email}, function(err, data){
		if(err){
			console.log('db err on find', err)
		}
		if(data){
			errors.push("This email is already signed up. Try signing in.")
		}
		if(errors.length == 0){
			var password = bcrypt.hashSync(req.body.password, 11);
			var email = req.body.email.toLowerCase();
			var name = req.body.name;
			Users.insert({name: name, email: email, password: password}, function(err, data){
				if(err){
					console.log('db err on insert', err);
				}
			})
			req.session.user = email;
			// req.session.name = name;
			res.redirect('/cities');
		}
		res.render('users/signup', {errors:errors});
	});
});
	


router.get('/signin', function(req, res, next) {
  if(req.session.user){
		res.render('index', {session: req.session.user});
	} else {
	res.render('users/signin', {error: []})
	}
});

router.post('/signin', function(req, res, next){
	var errors = [];
	if(!req.body.email.trim()) {
		errors.push("Email is required.")
	}
	if(!req.body.password.trim()){
		errors.push("Email is required.")
	}
	if(req.body.password.length < 8){
		errors.push("Password must be greater than 8 characters.")
	}
	Users.findOne({email:req.body.email}, function(err, data){
		var pw = req.body.password;
		if(!data) {
			errors.push("This email does not exist. Please sign up.")
		} else if(!bcrypt.compareSync(pw, data.password)){
			errors.push("Invalid Password.")
		}
		if(errors.length == 0){
			req.session.user = data.email;
			res.redirect('/cities');
		}
		res.render('users/signin', {errors:errors});
	})

})


router.get('/signout', function(req, res, next){
	req.session = null
	res.redirect('/');
})

module.exports = router;
