const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const getStatus = require('./status');
const getTrend = require('./trend');

// give us the possibility of manage request properly
const app = express()

// Automatically allow cross-origin requests
app.use(cors({ origin: true }))

// our single entry point for every message
app.post('/', async (req, res) => {
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
        let reply = 'Hello, ' + first_name + 
                    ', please choose one of the following commands! \n' + 
                    '/status \n' +
                    '/trend (under development) \n' +
                    '/news (under development) \n' +
                    '/fakenews (under development) \n' +
                    '/about'

        if (req.body.message.text === '/status' || req.body.message.text === '/status@SGCovidBot'){
            return await getStatus(req, res)
        }
        else if (req.body.message.text === '/trend' || req.body.message.text === '/trend@SGCovidBot'){
            return await getTrend(req, res)
        }
        else if (req.body.message.text === '/news' || req.body.message.text === '/news@SGCovidBot'){
            reply = 'Feature still under development'
        }
        else if (req.body.message.text === '/fakenews' || req.body.message.text === '/fakenews@SGCovidBot'){
            reply = 'Feature still under development'
        }
        else if (req.body.message.text === '/about' || req.body.message.text === '/about@SGCovidBot'){
            reply = 'This bot was developed by a Singaporean to help Singapore '+
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

