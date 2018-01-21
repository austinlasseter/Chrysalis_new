//Add one test that verifies that when you hit up the root url for your 
//client, you get a 200 status code and HTML.


//import all the things
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should(); //*?* difference between expect and should?

const {app, runServer, closeServer} = require('../app');
// const {TEST_DATABASE_URL} = require('../config');


chai.use(chaiHttp);

describe('Does the Server serve', function() {

	before(function() {
    return runServer();
		// return runServer(); // in the first interaction we didn't need to inpput the name of the db. why?
	});

	after(function() {
		return closeServer();
	});

	describe('html functionality', function () {

	it('should server html', function() {
		let res;
		return chai.request(app)
		res.should.have.status(200);

	});
}); //end of html describe

}); //end of outer describe