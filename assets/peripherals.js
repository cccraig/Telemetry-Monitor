const Chartist = require('chartist');
const Legend = require('chartist-plugin-legend');

var menu = document.querySelectorAll("[data-menu='peripherals']")[0];

var x_labels = [-30,-29,-28,-27,-26,-25,-24,-23,-22,-21,-20,-19,-18,-17,-16,
  -15,-14,-13,-12,-11,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0];

var series = [
  [5, 5, 10, 8, 7, 5, 4, null, null, null, 10, 10, 7, 8, 6, 9],
  [10, 15, null, 12, null, 10, 12, 15, null, null, 12, null, 14, null, null, null],
  [null, null, null, null, 3, 4, 1, 3, 4,  6,  7,  9, 5, null, null, null],
]

chart = drawCharts(series, x_labels)

$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
  chart.update({"labels":x_labels, "series":series})
});

function drawCharts(data, x_labels) {
  let options = {
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
        legendNames: ['Series1', 'Series2', 'Series3'],
      })
    ]
  };

  var chart = new Chartist.Line('#chart1', {
    labels: x_labels,
    series: data,
  }, options);

  return chart;
}



setInterval(function() {
  let n = series[0].length;

  for (var i = 0; i < series.length; i++) {
    if(n == 30) {
      series[i].shift();
    }
    series[i].push(Math.random() * 10);
  }

  chart.update({
    "labels":x_labels,
    "series":series
    });
}, 1000);
