const Store = require('electron-store');

class Settings {
  constructor() {
    this.store = new Store();
    this.settings = this.store.get('settings');
    this.defaultPort = this.store.get('defaultPort');
    this.populate();
    this.catchFormSubmit();
  }

  populate() {
    if (this.settings !== undefined) {
      for (const [name, value] of Object.entries(this.settings)) {
        for (const [n, v] of Object.entries(value)) {
          const s = "input[name='" + name + '-' + n + '"]"';
          document.querySelector(s).value = v;
        }
      }
    }
  }

  catchFormSubmit() {
    var settingsForm = document.querySelector('#form_settings');

    settingsForm.addEventListener('submit', function (e) {

      event.preventDefault();

      let data = {};

      let settings = document.querySelectorAll('#form_settings input');

      const l = settings.length;

      for (var i = 0; i < l; i++) {
        let inputName = settings[i].name;
        let parsed = inputName.split('-');
        const name = parsed[0];
        const option = parsed[1];
        const value = settings[i].value;

        if (name in data) {
          data[name][option] = value;
        } else {
          data[name] = {};
        }
      }

      store.set('settings', data);
    });
  }
}

module.exports = Settings;
