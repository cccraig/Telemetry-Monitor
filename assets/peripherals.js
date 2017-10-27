const Chartist = require('chartist');
const Legend = require('chartist-plugin-legend');

class Graphics {
  constructor() {
    this.x_labels = [-30,-29,-28,-27,-26,-25,-24,-23,-22,-21,-20,-19,-18,-17,-16, -15,-14,-13,-12,-11,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0];
    this.series = [[],[],[],[]];
    this.legend_names = ['Motor 1', 'Motor 2', 'Motor 3', 'Motor 5'];
    this.chart_name = 'motor_amperage';
    this.chart = '';
    this.options = {
      onlyInteger: true,
      fullWidth: true,
      chartPadding: {
        right: 10,
        top: 30
      },
      lineSmooth: Chartist.Interpolation.cardinal({
        fillHoles: true,
      }),
      low: 0,
      plugins: [
        new Legend({
          legendNames: this.legend_names,
        })
      ]
    };
  }



  draw() {
    this.chart = new Chartist.Line('#' + this.chart_name, {
      labels: this.x_labels,
      series: this.series,
    }, this.options);
  }



  update() {
    this.chart.update({"labels":this.x_labels, "series":this.series});
  }



  simulate() {
    let n = this.series[0].length;

    for (var i = 0; i < this.series.length; i++) {
      if(n == 30) {
        this.series[i].shift();
      }
      this.series[i].push(Math.random() * 10);
    }

    this.update();
  }
}


var g = new Graphics();
g.draw();

$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
  g.update();
});

setInterval(function() {
  g.simulate();
}, 1000);
