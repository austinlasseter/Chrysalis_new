'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const TransactionSchema = mongoose.Schema({
    date: {type: Date, required: true, unique: true},
    description: {type: String, required: true},
    debit: {type: Number, required: true},
    credit: {type: Number, required: true},
    balance: {type: Number, required: true},
    category {type: String, default: ''},

});

TransactionSchema.methods.serialize = function() {
    return {
        date: this.date|| '',
        description: this.description || '',
        debit: this.debit || '',
        credit: this.credit || '',
        balance: this.balance || '',
        category: this.category || '',
    };
};

TransactionSchema.methods.processTransaction = function(data) {
    // maybe process the data?
    // return xyz
};

TransactionSchema.methods.addCategory = function(Transaction, category) {
    //inputs: where category is the new string to be given to a transaction 
    // - this MUST already be a created category
    // maybe process the data?
    // return xyz
};


const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = {Transaction};