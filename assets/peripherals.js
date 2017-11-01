const Chartist = require('chartist');
const Legend = require('chartist-plugin-legend');

class Peripherals {
  constructor() {
    this.x_labels = this.range(-30, 0);
    this.series = [[], []];
    this.legend_names = ['Motor 1', 'Motor 2'];
    this.chart_name = 'motor_amperage';
    this.chart = '';
    this.options = {
      onlyInteger: true,
      fullWidth: true,
      chartPadding: {
        right: 10,
        top: 30,
      },
      lineSmooth: Chartist.Interpolation.cardinal({
        fillHoles: true,
      }),
      low: 0,
      plugins: [
        new Legend({
          legendNames: this.legend_names,
        }),
      ],
    };

    this.draw();

    // Want to use vanilla javascript to force the chart redraw.
    // the below works but is to slow, i.e. you see the mini chart before
    // it gets drawn large.
    // let p = document.querySelector('#menu1');
    // p.addEventListener('transitionend', this.update.bind(this), true);
    $('a[data-toggle=tab]').on('shown.bs.tab', this.update.bind(this));
  }

  range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx);
  }

  draw() {
    this.chart = new Chartist.Line('#' + this.chart_name, {
      labels: this.x_labels,
      series: this.series,
    }, this.options);
  }

  update() {
    this.chart.update({ labels: this.x_labels, series: this.series });
  }

  simulate() {
    let n = this.series[0].length;

    for (var i = 0; i < this.series.length; i++) {
      if (n == 30) {
        this.series[i].shift();
      }

      this.series[i].push(Math.random() * 10);
    }

    this.update();
  }
}

module.exports = Peripherals;
