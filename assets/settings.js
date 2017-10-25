const Store = require('electron-store');
const store = new Store()
const userSettings = store.get('settings');

// Make store global
global.app_special_user_settings = store;

if (userSettings != undefined) {
	$.each(userSettings, function(name, value) {
		$.each(value, function(n, v) {
			s = "#settings input[name='" + name + "-" + n + "']";
			$(s).val(v)
		});
	});
}

// Catch form submit
$("#settings").submit(function(e) {

	event.preventDefault();

	let values = {
		battery: {},
		temperature: {},
		speed: {}
	};

	let userSettings = $("#settings :input").not(':button');

	userSettings.each(function() {

		let parsed = this.name.split('-');
		let gauge = parsed[0];
		let option = parsed[1];

		values[gauge][option] = $(this).val();

	});

	store.set('settings', values);

});
