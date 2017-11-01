// Simple functions to produce fake data for testing
class Faker {
  constructor(interval=1000, min=5, max=20) {
    this.interval = interval;
    this.min = min;
    this.max = max;
    this.f = (function () {
      return ((Math.random() * max) + min);
    });
  }

  start() {
    this.data = {
      system: {
        compass: this.f(),
        power: this.f(),
        thermometer: this.f(),
        speedometer: this.f(),
      },
      peripherals: {
        motors: {
          motor_0: {
            amperage: this.f(),
            voltage: this.f(),
            speed: this.f(),
          },
          motor_1: {
            amperage: this.f(),
            voltage: this.f(),
            speed: this.f(),
          },
        },
        gps: {
          latitude: this.f(),
          longitude: this.f(),
          elevation: this.f(),
          satellites: this.f(),
        },
        air_temp: this.f(),
        barometer: this.f(),
      },
    };
  }
}

module.exports = Faker;
