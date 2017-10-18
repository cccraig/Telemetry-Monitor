const Chartist = require('chartist');
const Legend = require('chartist-plugin-legend');

var menu = document.querySelectorAll("[data-menu='peripherals']")[0];

$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
  drawCharts();
});

function drawCharts() {
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
        legendNames: ['Series1', 'Series2', 'Series3', 'Series4'],
      })
    ]
  };

  let x_labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  let series1 = [5, 5, 10, 8, 7, 5, 4, null, null, null, 10, 10, 7, 8, 6, 9];
  let series2 = [10, 15, null, 12, null, 10, 12, 15, null, null, 12, null, 14, null, null, null];
  let series3 = [null, null, null, null, 3, 4, 1, 3, 4,  6,  7,  9, 5, null, null, null];
  let series4 = [{x:3, y: 3},{x: 4, y: 3}, {x: 5, y: undefined}, {x: 6, y: 4}, {x: 7, y: null}, {x: 8, y: 4}, {x: 9, y: 4}];

  var chart = new Chartist.Line('#chart1', {
    labels: x_labels,
    series: [series1, series2, series3, series4],
  }, options);
}
