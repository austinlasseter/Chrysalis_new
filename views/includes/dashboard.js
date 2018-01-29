function addBudgetRow() {
	$('.transactions-table').append(`
		tr
			td.editable New Category
			td.editable 0

			td 0
			td 0`);
}
	

function onStart() {
  //calls all initializer functions.
  
  $('.create-category-button').click(addBudgetRow);
}


$(onStart);