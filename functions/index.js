const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const fetch = require('cross-fetch');

// give us the possibility of manage request properly
const app = express()

// Automatically allow cross-origin requests
app.use(cors({ origin: true }))


async function getData(params) {
    return fetch('https://spreadsheets.google.com/feeds/list/1lwnfa-GlNRykWBL5y7tWpLxDoCfs8BvzWxFjeOZ1YJk/2/public/values?alt=json')
    .then((response) => {
        return response.json()
    })
    .catch(error => {
        console.log(error)
    })
}

// our single entry point for every message
app.post('/', async (req, res) => {
    /*
        You can put the logic you want here
        the message receive will be in this
        https://core.telegram.org/bots/api#update
    */
    const isTelegramMessage = req.body
                            && req.body.message
                            && req.body.message.chat
                            && req.body.message.chat.id
                            && req.body.message.from
                            && req.body.message.from.first_name

    if (isTelegramMessage) {
        const chat_id = req.body.message.chat.id
        const { first_name, username } = req.body.message.from
        console.log('Sent  with message: [' + req.body.message.text + '] by ' 
        + first_name + ' ('+username+')')
        let reply = `Hello ${first_name}, please choose one of the commands!`
        if (req.body.message.text === '/status'){
            let data = await getData()
            data = data.feed.entry[0]
            let date = new Date(data.updated.$t)
            date_formatted = date.toLocaleDateString('EN-SG', {timeZone: "Asia/Shanghai"}) + ' ' +date.toLocaleTimeString('EN-SG', {timeZone: "Asia/Shanghai"})
            let days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
            let day = new Date(data.gsx$asof.$t+' 2020')
            reply = 
            'Hello, '+first_name+ ' here is your requested status update for Singapore: \n' + 
            '<i>(Updated as of: '+ date_formatted + ')</i>\n \n' +
            '&#128200; <b>New Cases on '+ days[day.getDay()] + ', ' + data.gsx$asof.$t + ':</b> ' +data.gsx$newcases.$t + '\n' +
            '&#128567; <b>Cases so far: </b>' + data.gsx$casessofar.$t + '\n' +
            '&#128513; <b>Recovered: </b>' + data.gsx$recovered.$t + '\n' +
            '&#128128; <b>Deceased: </b>' + data.gsx$deceased.$t + '\n' +
            '&#127976; <b>Still in hospital: </b>' + data.gsx$stillinhospital.$t + '\n' +
            '&#127968; <b>In isolation: </b>' + data.gsx$inisolation.$t + '\n'
        }
        else if (req.body.message.text === '/about'){
            reply = 'This bot was developed by a Singaporean to help Singapore'+
            'in it\'s COVID-19 efforts. Feel free to share if you find this useful. - LYF '
        }

        return res.status(200).send({
        method: 'sendMessage',
        parse_mode: 'HTML',
        chat_id,
        text: reply
        })
    }

    return res.status(200).send({ status: 'not a telegram message' })
})
// this is the only function it will be published in firebase
exports.router = functions.https.onRequest(app)