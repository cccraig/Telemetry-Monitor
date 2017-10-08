const canvas = require('canvas-gauges');
const BaseGauge = canvas.BaseGauge;
const RadialGauge = canvas.RadialGauge;


let Store = require('electron-store');
let store = new Store()
let userSettings = store.get('settings');


class BatteryGauge extends BaseGauge {

    constructor(options) {

        // Higher voltage is better
        options['highlights'] = [
            { from: options.minValue, to: options.x, color: 'rgba(255,30,0,.25)' },
            { from: options.x, to: options.y, color: 'rgba(255,255,0,.25)' },
            { from: options.y, to: options.maxValue, color: 'rgba(0,255,0,.25)' }
        ]

        // Inherit all options
        super(options);
    }

    draw() {
        return this;
    }
}












class Master {

    constructor(settings) {
        let cbs = settings.battery;
        let css = settings.speed;
        let cts = settings.temperature;

        cbs['majorTicks'] = this.linspace(cbs['minValue'], cbs['maxValue'], cbs['majorTicks']);
        css['majorTicks'] = this.linspace(css['minValue'], css['maxValue'], css['majorTicks']);
        cts['majorTicks'] = this.linspace(cts['minValue'], cts['maxValue'], cts['majorTicks']);

        cbs['renderTo'] = "battery-gauge";
        css['renderTo'] = "speed-gauge";
        cts['renderTo'] = "temperature-gauge";

        cbs = Object.assign({}, cbs, this.baseConfig(cbs));
        css = Object.assign({}, css, this.baseConfig(css));
        cts = Object.assign({}, cts, this.baseConfig(cts));

        cbs['highlights'] = [
            { from: cbs.minValue, to: cbs.x, color: 'rgba(255,30,0,.25)' },
            { from: cbs.x, to: cbs.y, color: 'rgba(255,255,0,.25)' },
            { from: cbs.y, to: cbs.maxValue, color: 'rgba(0,255,0,.25)' }
        ]

        this.cbs = cbs
        this.css = css
        this.cts = cts
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
            fontValue: "Led",
            highlights: [
                { from: opts.minValue, to: opts.x, color: 'rgba(0,255,0,.25)' },
                { from: opts.x, to: opts.y, color: 'rgba(255,255,0,.25)' },
                { from: opts.y, to: opts.maxValue, color: 'rgba(255,30,0,.25)' }
            ]
        }
    }


    compassConfig() {

        return {
            renderTo: "compass",
            width: 200,
            height: 200,
            minValue: 0,
            maxValue: 360,
            majorTicks: ["N","NE","E","SE","S","SW","W","NW","N"],
            minorTicks: 22,
            ticksAngle: 360,
            startAngle: 180,
            strokeTicks: false,
            highlights: false,
            colorPlate: "#222",
            colorMajorTicks: "#f5f5f5",
            colorMinorTicks: "#ddd",
            colorNumbers: "#ccc",
            colorNeedle: "rgba(240, 128, 128, 1)",
            colorNeedleEnd: "rgba(255, 160, 122, .9)",
            valueBox: false,
            valueTextShadow: false,
            colorCircleInner: "#fff",
            colorNeedleCircleOuter: "#ccc",
            needleCircleSize: 15,
            needleCircleOuter: false,
            animationRule: "linear",
            animationTarget: "plate",
            needleType: "line",
            needleStart: 75,
            needleEnd: 99,
            needleWidth: 3,
            borders: true,
            borderInnerWidth: 0,
            borderMiddleWidth: 0,
            borderOuterWidth: 10,
            colorBorderOuter: "#ccc",
            colorBorderOuterEnd: "#ccc",
            colorNeedleShadowDown: "#222",
            borderShadowWidth: 0,
            animationDuration: 1500
        }
    }



    linspace(a,b,n) {
        if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
        if(n<2) { return n===1?[a]:[]; }
        var i,ret = Array(n);
        n--;
        for(i=n;i>=0;i--) { ret[i] = Math.ceil((i*b+(n-i)*a)/n); }
        return ret;
    }
}


const master = new Master(userSettings);
var battery = new RadialGauge(master.cbs).draw();
var temperature = new RadialGauge(master.cts).draw();
var speed = new RadialGauge(master.css).draw();
var compass = new RadialGauge(master.cps).draw();