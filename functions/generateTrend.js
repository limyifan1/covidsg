// 600x600 canvas size
var stackedBarChartSpec = require('./stacked-bar-chart.spec.json');
var data = require('./data.spec.json');

var vega = require('vega')
var fs = require('fs')

let date
let compiled = {}
let count = 0
data.features.forEach(element => {
    date = new Date(element.attributes.Date).toLocaleDateString('EN-SG', {timeZone: "Asia/Shanghai"})
    stackedBarChartSpec.data[0].values.push({
        // "x": date, 
        "x": count,
        "y": element.attributes.Confirmation_Total - element.attributes.Discharge_Total, 
        "c": 1
    })
    stackedBarChartSpec.data[0].values.push({
        // "x": date, 
        "x": count,
        "y": element.attributes.Discharge_Total, 
        "c": 0
    })
    count+=1
    element.attributes.Date = date
    compiled[date] = element.attributes
});

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

// console.log(stackedBarChartSpec.data[0].values)