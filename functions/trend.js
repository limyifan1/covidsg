const fetch = require('cross-fetch');

async function getTrend(req, res){
    var today = new Date();
    var date = today.getDate() +'-'+(today.getMonth()+1) + '-' + today.getFullYear();
    const chat_id = req.body.message.chat.id
    status = 'Here\'s the chart of the number of cases from February to ' + 'today ' + date
    return res.status(200).send({
        method: 'sendMediaGroup',
        media: [
            'https://firebasestorage.googleapis.com/v0/b/covidsgbot.appspot.com/o/daily.png?alt=media&token=500e745b-a88d-4a29-babf-483b2c6ace02',
            'https://firebasestorage.googleapis.com/v0/b/covidsgbot.appspot.com/o/cumulative.png?alt=media&token=f756ac3d-193f-4e57-b1ba-f8137565260e'
        ],
        chat_id,
    })
}


module.exports = getTrend