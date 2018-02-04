// https://stackoverflow.com/questions/6012823/how-to-make-html-table-cell-editable
function addCategoryRow() {
	// adds new category row to dashboard/budget page
	// this is the first step in the process of creating a new category
	alert('adding the category');
	console.log('added category row');
	$('.budget-table').append(`
		<tr class="new-category-row" >
		  <td><input type="text" value="new category" class="new-category"  /></td>
		  <td contenteditable="true" type="number">0</td>
		  <td>0</td>
		  <td>0</td>
		</tr>
		`);

};


$(document).on('keyup', '.new-category', function (e) {
	console.log($('.new-category').val());
    if (e.keyCode == 13) {
    	console.log($('.new-category').val());
    	//is input empty

        $.ajax({
			  type: "POST",
			  url: 'api/categories',
			  data: {categoryName: $('.new-category').val(),
			  	//-${new-category}.value,
			  budgeted: 0,
			  activity: 0,
			  available: 0}, //or e.target.value
			  dataType: 'json',
		});

		// console.log(req.user.categories);
        
    }
    // $(".new-category-row").addClass('category-row');
    // $(".new-category-row").removeClass('new-category-row');
    // $(".new-category").removeClass('new-category');

});

// $.ajax({
// 	  type: "POST",
// 	  url: 'api/categories',
// 	  data: {categoryName: 'testing',
// 	  budgeted: 0,
// 	  activity: 0,
// 	  available: 0}, //or e.target.value
// 	  dataType: 'JSON'
// });

// $( document ).ready(function() {
    
// 	$.ajax({
// 		  type: "POST",
// 		  url: 'api/categories',
// 		  data: {categoryName: 'testing', budgeted: 0, activity: 0, available: 0}, 
// 		  //or e.target.value
// 		  dataType: 'json',
// 	});
// 	console.log(categories);
// });

// $.ajax({
//   type: 'POST',
//   url: url,
//   data: postedData,
//   dataType: 'json',
//   success: callback
// });




