$(function() {

	// Populate form with submitted data
	const Store = require('electron-store');
	const store = new Store()

	let data = store.get('settings');

	if (data != undefined) {
		$.each(data, function(name, value) {
			$("input[name='" + name + "'").val(value)
		});
	}

	// Catch form submit
	$("#settings").submit(function(e) {

		event.preventDefault();

		let values = {};

		let data = $("#settings :input");

		data.each(function() {
			values[this.name] = $(this).val();
		});

		store.set('settings', values);

	});
});