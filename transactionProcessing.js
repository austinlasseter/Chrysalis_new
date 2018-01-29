// https://stackoverflow.com/questions/6012823/how-to-make-html-table-cell-editable

generateTransactionTable( {
	// User.find() is async, so you can't use a return value to get a resultant value. 
	// Instead, use a callback
	console.log(req.user.transactions);
	// arrayOfTransactions = req.user.transactions
	// User.findbyid({transactions})
 //    .then( results => {
 //    	console.log('these are the generatetransactionTable find query results');
 //    	console.log(results);
	// 	const transdate = (query)
	// 	const description = (query)
	// 	const debit = (query)
	// 	const credit = (query)
	// 	const category = (query)

	//  	const transactionTableText = (`
	//  		tr.transaction-row
	// 			td ${transdate}
	// 			td ${description}
	// 			td ${category}
	// 			td ${debit}
	// 			td ${credit}`);

	// return transactionTableText
	// }) //end of .then
} 


// $('.transaction-table').append(generateTransactionTable(transdate, description, debit, credit, category))


