/*global $*/
$(document).ready(function () {
    "use strict";
    $(".button-collapse").sideNav();
    $('select').material_select();
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15,// Creates a dropdown of 15 years to control year
        min: new Date() //past is past, move on na.
    });
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
    $('.tab-items').click(function () {
        $('.tab-items').removeClass("active").removeClass("white-text").addClass("white-text");
        $(this).removeClass("white-text").addClass("active");
    });
});
