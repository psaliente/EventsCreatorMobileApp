$( document ).ready( function() {
 	 $(".button-collapse").sideNav();
 	 $('select').material_select();
	  $('.datepicker').pickadate({
	    selectMonths: true, // Creates a dropdown to control month
	    selectYears: 15 // Creates a dropdown of 15 years to control year
	    min: new Date()
	  });

	    $(document).ready(function(){
	    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
	    $('.modal-trigger').leanModal();
	  });
});
$(function(){
	var operation = "A"; //"A"=Adding;
	var selected_index = -1;
	var tbEvents = localStorage.getItem("tbEvents");

	tbEvents = JSON.parse(tbEvents);
	if(tbEvents == null) 
		tbEvents = [];
});
