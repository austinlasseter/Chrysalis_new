'use strict';
var express = require('express');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Category = require('../../models/category'); 

const config = require('../../config');

//POST: create new category
router.post('/', jsonParser, (req, res) => {
  console.log('we are in the create new category post');

  req.user.categories.push(req.body);
  req.user.save(function (err) {
    if (err) console.log(err);
        })
res.status(201);
}) //end of new category POST


router.put('/:id/budget', jsonParser, (req, res) => { // TO DO
  //update a category to have a 'budgeted' amount
  // also will likely do the calculation of 'activity' within this post
  console.log('you are in the PUT for category-budget updates (in the dashboard page)');
  //console.log(req.user);
  req.user.categories.update({
    //first the query

    categoryName: this.closest('tr').categoryName.val() // ?? how do I actually get this??
    },
    {// then the update
    budgeted: $(".category-row").budgeted.value // ?? how do I actually get this?? And it has to come from a dropdown of available values.
  });
});


router.put('/', jsonParser, (req, res) => {
  //on success of updating a transaction's category, re calculate category.activity
  // for each category in user.categories
    // get a cursor:
    var categories = req.user.categories;
    var transactions = req.user.transactions;
    console.log(categories);
    console.log(transactions);

    

    // categories.forEach( 
    //   // let debit = 0;
    //   // var credit = 0;
    //   transactions.forEach(
    //       if (transactions.category == categories.categoryName) {
    //       debit = debit + transaction.debit

    //       credit = credit + transaction.credit
    //       }) // end of transaction for each
    //   category.activity = debit + credit
    //   category.save()
    //   ) // end of category for each
}) // end of category PUT for category activity






router.put('/categories/categoryName', jsonParser, (req, res) => { // TO DO
  //updates the category Name.
  // this also must propagate the name change to all transactions with that name change
  req.user.categories.update({
    //first the query

    categoryName: this.closest('tr').categoryName.val() // ?? how do I actually get this??
    },
    {// then the update
    //budgeted: $(".category-row").budgeted.value // ?? how do I actually get this?? And it has to come from a dropdown of available values.
  });
});

router.delete('/categories/categoryName', jsonParser, (req, res) => { // TO DO
  //totally deletes the category
  // this also must propagate the name change to all transactions with that assigned categoryName
  req.user.categories.delete({
    //first the query

    categoryName: this.closest('tr').categoryName.val() // ?? how do I actually get this??
    },
    {// then the update
    //budgeted: $(".category-row").budgeted.value // ?? how do I actually get this?? And it has to come from a dropdown of available values.
  });
});


module.exports = router;