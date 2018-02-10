'use strict';
var express = require('express');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Transaction = require('../../models/transactions'); 

const config = require('../../config');


router.put('/:id/category', jsonParser, (req, res) => { // TO DO
	console.log('INSIDE TRANSACTION CATEGORIZATION PUT REQUEST')
	console.log(req.params.id);
	console.log(req.data);
	console.log(req);
  //update a transaction to be categorized
  // console.log('this is req.body');
  // console.log(req.body);// this should have the data
  // console.log('you are in the PUT for categorizing transactions (in the transactions page)');
  // console.log(req.user);
  		req.user.transactions.find({_id: req.params.id}, function(transaction) {
  			console.log(transaction)
  			transaction.category = req.data.category 
  			transaction.save();
  			// res.json.(transaction);
  		})
  		// req.user.transactions.update(
  		// 	{ _id: req.params.id},
  		// 	{$push: {
  		// 		req.data
  		// 	} // end of object being pushed
  		// 	} // end of $push
  		// 	) // end of .update
    
}); // end of PUT

module.exports = router;