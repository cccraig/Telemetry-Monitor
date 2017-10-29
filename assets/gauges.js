const canvas = require('canvas-gauges');
const RadialGauge = canvas.RadialGauge;
let store = global.app_special_user_settings;
let userSettings = store.get('settings');

class Guages {
  constructor(settings) {
    if (settings == undefined) {
      settings = {
            battery: {
                minValue: 0,
                x: 24,
                y: 36,
                maxValue: 48,
                units: 'Volts',
                majorTicks: 11,
                minorTicks: 5,
              },
            temperature: {
                minValue: 0,
                x: 65,
                y: 85,
                maxValue: 100,
                units: 'C',
                majorTicks: 11,
                minorTicks: 3, },
            speed: {
                minValue: 0,
                x: 15,
                y: 20,
                maxValue: 25,
                units: 'km/h',
                majorTicks: 6,
                minorTicks: 2, },
          };
    }

    let cbs = settings.battery;
    let css = settings.speed;
    let cts = settings.temperature;

    cbs.majorTicks = this.linspace(cbs.minValue, cbs.maxValue, cbs.majorTicks);
    css.majorTicks = this.linspace(css.minValue, css.maxValue, css.majorTicks);
    cts.majorTicks = this.linspace(cts.minValue, cts.maxValue, cts.majorTicks);

    cbs.renderTo = 'battery-gauge';
    css.renderTo = 'speed-gauge';
    cts.renderTo = 'temperature-gauge';

    cbs = Object.assign({}, cbs, this.baseConfig(cbs));
    css = Object.assign({}, css, this.baseConfig(css));
    cts = Object.assign({}, cts, this.baseConfig(cts));

    cbs.highlights = [
        { from: cbs.minValue, to: cbs.x, color: 'rgba(255,30,0,.25)' },
        { from: cbs.x, to: cbs.y, color: 'rgba(255,255,0,.25)' },
        { from: cbs.y, to: cbs.maxValue, color: 'rgba(0,255,0,.25)' },
    ];

    this.cbs = cbs;
    this.css = css;
    this.cts = cts;
    this.cps = this.compassConfig();
  }

  baseConfig(opts) {

    return {
        width: 200,
        height: 200,
        title: false,
        value: 0,
        strokeTicks: false,
        colorPlate: '#4f4d4d',
        colorMajorTicks: '#f5f5f5',
        colorMinorTicks: '#ddd',
        colorTitle: '#fff',
        colorUnits: '#ccc',
        colorNumbers: '#eee',
        colorNeedle: 'rgba(240, 128, 128, 1)',
        colorNeedleEnd: 'rgba(255, 160, 122, .9)',
        valueBox: true,
        animationRule: 'bounce',
        animationDuration: 500,
        fontValue: 'Led',
        highlights: [
            { from: opts.minValue, to: opts.x, color: 'rgba(0,255,0,.25)' },
            { from: opts.x, to: opts.y, color: 'rgba(255,255,0,.25)' },
            { from: opts.y, to: opts.maxValue, color: 'rgba(255,30,0,.25)' },
        ],
      };
  }

  compassConfig() {
    return {
        width: 200,
        height: 200,
        renderTo: 'compass',
        minValue: 0,
        maxValue: 360,
        majorTicks: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'],
        minorTicks: 22,
        ticksAngle: 360,
        startAngle: 180,
        strokeTicks: false,
        highlights: false,
        colorPlate: '#222',
        colorMajorTicks: '#f5f5f5',
        colorMinorTicks: '#ddd',
        colorNumbers: '#ccc',
        colorNeedle: 'rgba(240, 128, 128, 1)',
        colorNeedleEnd: 'rgba(255, 160, 122, .9)',
        valueBox: false,
        valueTextShadow: false,
        colorCircleInner: '#fff',
        colorNeedleCircleOuter: '#ccc',
        needleCircleSize: 15,
        needleCircleOuter: false,
        animationRule: 'linear',
        animationTarget: 'plate',
        needleType: 'line',
        needleStart: 75,
        needleEnd: 99,
        needleWidth: 3,
        borders: true,
        borderInnerWidth: 0,
        borderMiddleWidth: 0,
        borderOuterWidth: 10,
        colorBorderOuter: '#ccc',
        colorBorderOuterEnd: '#ccc',
        colorNeedleShadowDown: '#222',
        borderShadowWidth: 0,
        animationDuration: 1500,
      };
  }

  linspace(a, b, n) {
    if (typeof n === 'undefined') n = Math.max(Math.round(b - a) + 1, 1);
    if (n < 2) return n === 1 ? [a] : [];
    var i;
    var ret = Array(n);
    n--;
    for (i = n; i >= 0; i--) {
      ret[i] = Math.ceil((i * b + (n - i) * a) / n);
    }

    return ret;
  }

  resizeCanvas() {
    $('.dash').each(function (key, el) {
      let dashWidth = el.offsetWidth;
      let gaugeId = el.querySelector('canvas').id;
      let w = Math.floor(dashWidth / 1.625);
      gauges[key].update({ height: w, width: w });
    });
  }
}

var master = new Gauges(userSettings);
let battery = new RadialGauge(master.cbs);
let temperature = new RadialGauge(master.cts);
let speed = new RadialGauge(master.css);
let compass = new RadialGauge(master.cps);

var gauges = [battery, temperature, speed, compass];

for (var i = 0; i < gauges.length; i++) {
  gauges[i].draw();
}

master.resizeCanvas();

window.addEventListener('resize', master.resizeCanvas, false);

setInterval(function () {
  w = Math.random() * 20;
  for (var i = 0; i < gauges.length; i++) {
    gauges[i].update({ value: w });
  }
}, 1000);
