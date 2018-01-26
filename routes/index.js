'use strict';
var express = require('express');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const config = require('../config');
// var csv = require('fast-csv');
var fs = require('fs'); 
var csv = require('csv-parser');

var {Transaction} = require('../models/transactions');

const {User} = require('../models/user');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

//define the local strategy
passport.use(new Strategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            console.log(user);
            console.log(err);
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            // return done(null, user);
            user.validatePassword(password)
                .then(function (value) {
                    console.log(value);
                    if (value) {
                        return done(null, user)
                    } else {
                        return done(null, false);
                    }
                })
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

/* GET home page. */
router.get('/', function(req, res, next) { //gives the homepage
  // res.send('respond with a resource');
  res.render('landing', { title: 'Express' });
});

// GET budget dashboard page
router.get('/dashboard', function(req, res, next) {
  console.log('this is dashboard, req');
  console.log(req);
	    if(!req.user){
        res.redirect('/')
    } else {
        res.render('dashboard');
  }
});

// GET transactions page
router.get('/transactions', function(req, res, next) {
	    if(!req.user){
        res.redirect('/')
    } else {
        res.render('transactions');
  }
});

// GET upload page
router.get('/upload', function(req, res, next) {
	   //  if(!req.user){
    //     res.redirect('/')
    // } else {
        res.render('upload');
  // }
});

// GET new user creation page

router.get('/new-user', function(req, res, next) {
  res.render('new-user', { title: 'Express' });
});

// POST: LOGIN
router.post('/', passport.authenticate('local', { 
	failureRedirect: '/' }), 
function(req, res) {
  console.log('inside login post');
    res.redirect('/dashboard');
});

var type = upload.single('csvFile');
// POST: UPLOAD TRANSACTIONS FILE
router.post('/upload', type, function(req, res) {
  console.log(req.file);
  if (!req.file)
        return res.status(400).send('No files were uploaded.');

    fs.createReadStream(req.file.path)
  .pipe(csv())
  .on('data', function (data) {
    console.log(data);
  let results = {};
  results.transdate = data['Post Date'];
  console.log('this is transdate:', results.transdate);
  results.description = data['Description'];
  results.debit = data['debit'];
  results.credit = data['credit'];
  results.balance = data['balance'];
  results.category = data['category'];
  console.log('these are the results:', results);

    Transaction.find(results)
    .count()
    .then(count => {
      if (count > 0) {
        // That transaction was already in the db
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'transaction already in db',
          location: 'transaction'
        });
      }
      // If that transaction isn't in the db, then:
      return Transaction;
    })

    .then( transaction => {
      console.log('that transaction was new, so we will add it');
      return Transaction.create({
        results
        // .transdate, results.description, results.debit, results.credit, results.balance, results.category
      });
    })
  }) // closes on
  .on('end', function () {
    console.log('at the end');
})
});


// POST: CREATE NEW USER
router.post('/new-user', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));
  console.log('we are in the create new user post');
  console.log(req.body);

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }
  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );
  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 10,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, firstName = '', lastName = ''} = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => {
    	console.log('there was no existing user with that username, so we will create it');
      return User.create({
        username,
        password: hash,
        firstName,
        lastName
      });
    })
    .then( function() {
    	console.log('successful creation of user');
    	res.redirect('/');
    
      // return res.status(201).json(user.serialize());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});



module.exports = router;
