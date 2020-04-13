const fetch = require('cross-fetch');
var cumulative = require('./cumulative.spec.json');
var daily = require('./daily.spec.json');
var vega = require('vega')
var fs = require('fs')

// var data = require('./data.spec.json');

async function getData(params) {
  return fetch('https://services6.arcgis.com/LZwBmoXba0zrRap7/arcgis/rest/services/COVID_19_Prod_B_cumulative/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Date%20asc&resultOffset=0&resultRecordCount=2000&cacheHint=true')
  .then((response) => {
      return response.json()
  })
  .catch(error => {
      console.log(error)
  })
}

async function retrieveData() {
  let data =  await getData()
  let date
  let compiled = {}
  let count = 0
  data.features.forEach(element => {
    date = new Date(element.attributes.Date).toLocaleDateString('EN-SG', {timeZone: "Asia/Shanghai"})
    if (element.attributes.Discharge_Total >= 100){
      cumulative.data[0].values.push({
        // "x": date, 
        "x": count,
        "y": element.attributes.Discharge_Total, 
        "c": "Discharged Cases"
      })
      cumulative.data[0].values.push({
        // "x": date, 
        "x": count,
        "y": element.attributes.Confirmation_Total - element.attributes.Discharge_Total, 
        "c": "Active Cases"
      })
          daily.data[0].values.push({
            // "x": date, 
            "x": count,
            "y": element.attributes.Confirmation_Volume, 
            "c": 1
          })
          count+=1
          element.attributes.Date = date
          compiled[date] = element.attributes
    }
  });

  var view = new vega
    .View(vega.parse(cumulative))
    .renderer('none')
    .initialize();

  // generate static PNG file from chart
  view
    .toCanvas()
    .then((canvas) => {
      // process node-canvas instance for example, generate a PNG stream to write var
      stream = canvas.createPNGStream();
      console.log('Writing PNG to file...')
      fs.writeFile('cumulative.png', canvas.toBuffer(), ()=>{
          console.log("Rendered File")
      })
      return true
    })
    .catch((err) => {
      console.log("Error writing PNG to file:")
      console.error(err)
    });

    view = new vega
    .View(vega.parse(daily))
    .renderer('none')
    .initialize();

  // generate static PNG file from chart
  view
    .toCanvas()
    .then((canvas) => {
      // process node-canvas instance for example, generate a PNG stream to write var
      stream = canvas.createPNGStream();
      console.log('Writing PNG to file...')
      fs.writeFile('daily.png', canvas.toBuffer(), ()=>{
          console.log("Rendered File")
      })
      return true
    })
    .catch((err) => {
      console.log("Error writing PNG to file:")
      console.error(err)
    });

}

retrieveData()