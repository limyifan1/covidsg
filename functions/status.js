async function getData(params) {
    return fetch('https://spreadsheets.google.com/feeds/list/1lwnfa-GlNRykWBL5y7tWpLxDoCfs8BvzWxFjeOZ1YJk/2/public/values?alt=json')
    .then((response) => {
        return response.json()
    })
    .catch(error => {
        console.log(error)
    })
}

async function getStatus(){
    let data = await getData()
    data = data.feed.entry[0]
    let date = new Date(data.updated.$t)
    date_formatted = date.toLocaleDateString('EN-SG', {timeZone: "Asia/Shanghai"}) + ' ' +date.toLocaleTimeString('EN-SG', {timeZone: "Asia/Shanghai"})
    let days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    let day = new Date(data.gsx$asof.$t+' 2020')
    status = 
    'Hello, '+first_name+ ' here is your requested status update for Singapore: \n' + 
    '<i>(Updated as of: '+ date_formatted + ')</i>\n \n' +
    '&#128200; <b>New Cases on '+ days[day.getDay()] + ', ' + data.gsx$asof.$t + ':</b> ' +data.gsx$newcases.$t + '\n' +
    '&#128567; <b>Cases so far: </b>' + data.gsx$casessofar.$t + '\n' +
    '&#128513; <b>Recovered: </b>' + data.gsx$recovered.$t + '\n' +
    '&#128128; <b>Deceased: </b>' + data.gsx$deceased.$t + '\n' +
    '&#127976; <b>Still in hospital: </b>' + data.gsx$stillinhospital.$t + '\n' +
    '&#127968; <b>In isolation: </b>' + data.gsx$inisolation.$t + '\n'
    return status
}


module.exports = getStatus