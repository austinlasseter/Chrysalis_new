'use strict';
var express = require('express');
var mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Transaction = require('../../models/transactions'); 


const config = require('../../config');


router.put('/:id/category', jsonParser, (req, res) => { // TO DO
	console.log('INSIDE TRANSACTION CATEGORIZATION PUT REQUEST - transactions.js, put to id/category');
	// console.log(req.params.id);
	// console.log(req.body);
	// console.log(req.user);

  var transaction = req.user.transactions.id(req.params.id);
  console.log('TRANSACTION FROM PUT TO ID/CATEGORY:');
  console.log(transaction);
  		//req.user.findById({"transactions._id": mongoose.Types.ObjectId(req.params.id)}, function(transaction, err) {
  		//req.user.transactions.find({"transactions.$id": ObjectId(req.params.id)}, function(transaction, err) {
  	
    //UNCOMMENT 32-39
  			transaction.category = req.body.category;
        console.log(transaction); //--> 2/18 3pm this DOES show the transaction with the category sent (hardcoded)
        transaction.markModified('category');
          // EXAMPLE of saving docs like this to get the change to percolate to db
          //        doc.mixed.type = 'changed';
          //        doc.markModified('mixed.type');
          //        doc.save() // changes to mixed.type are now persisted 
        transaction.push();
  			transaction.save();
        // ALSO NOTE: save() returns a promise, so you can do a .then
        console.log(transaction);
  			// res.json.(transaction);
  		//});



//Are your ids ObjectIds or strings? Assuming ObjectId,
//db.collection.find( { 'favouriteSubscribers.$id': ObjectId("4f8b593c3a4b0b045e000039") } )
//No need for $regex. But make sure you spell the field name correctly, with a $: favouriteSubscribers.$id

  		// req.user.transactions.update(
  		// 	{ _id: req.params.id},
  		// 	{$push: {
  		// 		req.data
  		// 	} // end of object being pushed
  		// 	} // end of $push
  		// 	) // end of .update
    
}); // end of PUT

module.exports = router;