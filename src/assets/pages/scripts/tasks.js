var AppTask = function () {

    return {

        //main function to initiate the module
        init: function () {
			$('.task-table input[type="checkbox"]').change(function() {
				if ($(this).is(':checked')) {
					$(this).parents('li').addClass("task-done");
				} else {
					$(this).parents('li').removeClass("task-done");
				}
			});
        }

    };

}();

jQuery(document).ready(function() {
    AppTask.init();
});