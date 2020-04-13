// START vega-demo.js
var vega = require('vega')
var fs = require('fs')

var stackedBarChartSpec = require('./stacked-bar-chart.spec.json');

// create a new view instance for a given Vega JSON spec
var view = new vega
  .View(vega.parse(stackedBarChartSpec))
  .renderer('none')
  .initialize();

// generate static PNG file from chart
view
  .toCanvas()
  .then((canvas) => {
    // process node-canvas instance for example, generate a PNG stream to write var
    stream = canvas.createPNGStream();
    console.log('Writing PNG to file...')
    fs.writeFile('stackedBarChart.png', canvas.toBuffer(), ()=>{
        console.log("Rendered File")
    })
    return true
  })
  .catch((err) => {
    console.log("Error writing PNG to file:")
    console.error(err)
  });
// END vega-demo.js

