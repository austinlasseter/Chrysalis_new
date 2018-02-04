'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const CategorySchema = mongoose.Schema({
    categoryName: {type: String, required: true},
    budgeted: {type: Number},
    activity: {type: Number},
    available: {type: Number},

});

CategorySchema.methods.serialize = function() {
    return {
        categoryName: this.categoryName || '',
        budgeted: this.budgeted || '',
        activity: this.activity || '',
        available: this.available || '',
    };
};

//const Category = mongoose.model('Category', CategorySchema);

module.exports = CategorySchema;