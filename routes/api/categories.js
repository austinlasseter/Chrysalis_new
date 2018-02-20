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
  var budgetValue = (req.body['budgeted']);
  console.log('this is the server side budgetValue from the budgetValue PUT request');
  console.log(budgetValue);
  console.log('this is req.params.id');
  console.log(req.params.id);
  var categoryId = req.params.id;

  var category = req.user.categories.id(req.params.id);
  // console.log('TRANSACTION FROM PUT TO ID/CATEGORY:');
  // console.log('line 26');
  // console.log(transaction);
    //UNCOMMENT 32-39
  category.budgeted = budgetValue;

  req.user.save(function (err, user) {
    if(err){
      res.sendStatus(500);
    } else {
      res.send(category);
    }
  });
});


router.put('/', jsonParser, (req, res) => {
  //on success of updating a transaction's category, re calculate category.activity
  // for each category in user.categories
    // get a cursor:
    console.log("here");

    var categories = req.user.categories;
    var transactions = req.user.transactions;

    let credits = {};
    let debits = {};

    categories.forEach(function (category) {
        // console.log(category);
        let debit = 0;
        let credit = 0;
        transactions.forEach(function (transaction) {
            if(transaction.category == category.categoryName){
              if (transaction.debit) {
                debit = debit + parseFloat(transaction.debit);
              } else {
                debit = debit;
              }
              if (transaction.credit) {

                credit = credit + parseFloat(transaction.credit);
              } else {
                credit = credit;
              }
              } // end if ==
            }); // end for each of transaction
      

        console.log(category);

        category.activity = credit + debit;
        console.log(category);
        req.user.save();

    }); // ends categories for each 
      req.user.save(function (err, user) {
        if(err){
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
}); // end of category PUT for category activity






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