'use strict';
var express = require('express');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Category = require('../../models/category'); //how do I give the right path??

const config = require('../../config');

//POST: create new category

router.post('/categories', jsonParser, (req, res) => {
  console.log('this is req.body');
  console.log(req.body);
  // console.log('categories POST');
  // const requiredFields = ['categoryName'];
  console.log('we are in the create new category post');
	// var category = new category({categoryName: ['categoryName'],
  //                     budget: 0,
  //                     activity: 0,
  //                     available: 0});

        req.user.categories.push(req.body);
        req.user.save(function (err) {
          if (err) console.log(err);
          //console.log('Success!');
        })

  // var Category = mongoose.model('Category', CategorySchema);
  // req.user.category.create({
  //   var data = req.body;
  // req.user.categories.create(data, 
  //   function (err) {
  //     if (err) console.log(err);
  //   })
  // .then(function() {
  //   console.log('successful creation of category')
  //   res.status(201);
  // })
res.status(201);
}) //end of new category POST


router.put('/categories', jsonParser, (req, res) => {
  //update a category to have a 'budgeted' amount
  // also will likely do the calculation of 'activity' within this post
  console.log('you are in the PUT for category updates');
  //console.log(req.user);
  req.user.categories.update({
    //first the query
    categoryName: this.parent().categoryName // ?? how do I actually get this??
    },
    {// then the update
    budgeted: $(".category-row").budgeted.value // ?? how do I actually get this?? And it has to come from a dropdown of available values.
  });
});


module.exports = router;