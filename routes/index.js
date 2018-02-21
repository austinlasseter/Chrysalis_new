'use strict';
var express = require('express');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
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
            console.log(err);
            console.log(user);
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
	    if(!req.user){
        res.redirect('/')
    } else {
      res.render('dashboard', {
        categories: req.user.categories
      }); //end of dashboard

  } // end of else
}); //end of GET DASHBOARD

// GET transactions page
router.get('/transactions', function(req, res, next) {
    // console.log(req.user.transactions);
    if(!req.user){
      res.redirect('/')
    } else {
       res.render('transactions', {
        transactions: req.user.transactions,
        categories: req.user.categories
       });
  }
});

// GET upload page
router.get('/upload', function(req, res, next) {
	    if(!req.user){
        res.redirect('/')
    } else {
        res.render('upload');
  }
});

router.get('/faq', function(req, res, next) {

     //  if(!req.user){
    //     res.redirect('/')
    // } else {
         res.render('faq');
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

  res.redirect('/dashboard');
});

var type = upload.single('csvFile');

// POST: UPLOAD TRANSACTIONS FILE
//let requser;
router.post('/upload', type, function(req, res) {

  var resultsArray = [];
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }
  fs.createReadStream(req.file.path)
  // helpful explanation of streams in node:
  // https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93
  .pipe(csv())
  .on('data', function (data) { //
    var oneRow = {};
    oneRow.transdate = data['Post Date'];
    oneRow.description = data['Description'];
    oneRow.debit = data['Debit'];
    oneRow.credit = data['Credit'];
    oneRow.balance = data['Balance_anon'];
    oneRow.category = 'uncategorized';

    console.log('here are the pre upload transactions:');
    console.log(req.user.transactions);
    var allTransactions = req.user.transactions;

    var testArray = req.user.transactions.filter(transaction => transaction.transdate === oneRow.transdate);
    console.log('this is testArray');
    console.log(testArray.length);
    var countArray = allTransactions.filter(transaction => transaction.transdate === oneRow.transdate 
      && transaction.description === oneRow.description
      && transaction.balance === oneRow.balance
      );
    console.log(countArray.length);
      if (countArray.length ==0) {
        resultsArray.push(oneRow);
      } 
      console.log('index line 152');
      console.log(resultsArray);
     return resultsArray;
    }) // end of on.data
    // .on('end', function (results) {
    //   console.log('this is resultsArray from index readStream from the csv');
    //   console.log(resultsArray);
    //   var cleanedArray = {};


    //   return cleanedResultsArray;
    // })
    .on('end', function () {
      console.log('yep it is parsed');
        // console.log('THIS IS REQ.USER.trans POST TRANS PUSH');
        // console.log(req.user.transactions);
        req.user.save(function (err) {
            if (err) {
              console.log(err);
              res.sendStatus(500);
            }
            else {
                resultsArray.forEach( function (row, currentIndex) {
                  req.user.transactions.push(row);
                });
                req.user.save(function (err) {
                  if (err) {
                    res.send(500);
                  } else {
                    res.redirect('transactions');
                  }
                })
              //} // end of if results array length == currentindex+1
            } //end of else
          }); //end of req.user.save()

    }); // end of on end
    console.log('at the end');
    //res.redirect('transactions');

}); // end of post


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
    .then (function(user) {
      //intialize with categories: 
      var initialCategoryList = ['housing', 'groceries', 'transportation', 'clothes', 'giving', 'books', 'uncategorized']

      initialCategoryList.forEach(function(category) {
        var category = {categoryName: category,
                      budgeted: 0,
                      activity: 0,
                      available: 0}
        console.log(category);
        user.categories.push(category);
        
        }); 
        user.save(function (err) {
          if (err) console.log(err);
          //console.log('Success!');
          })
          // end of 'then' for initializing categories
      // for(var i = 0; i < initialCategoryList.length; i++) {
      //   console.log('this is i in category array');
      //   console.log(i);
      //   var category = {categoryName: initialCategoryList.length[i],
      //                 budget: 0,
      //                 activity: 0,
      //                 available: 0}
      //   user.categories.push(category);
      //   user.save(function (err) {
      //     if (err) console.log(err);
      //     //console.log('Success!');
      //   })
      // } // end of for var

       
      return
    }) // end of then
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
