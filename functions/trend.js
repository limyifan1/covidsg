const fetch = require('cross-fetch');

async function getTrend(req, res){
    var today = new Date();
    var date = today.getDate() +'-'+(today.getMonth()+1) + '-' + today.getFullYear();
    const chat_id = req.body.message.chat.id
    status = 'Here\'s the chart of the number of cases from January 23 to ' + 'today ' + date
    return res.status(200).send({
        method: 'sendPhoto',
        photo: 'https://firebasestorage.googleapis.com/v0/b/covidsgbot.appspot.com/o/stackedBarChart.png?alt=media&token=1e27d11e-1d0f-4643-ac17-b47b6d920307',
        parse_mode: 'HTML',
        chat_id,
        caption: status
        })
}


module.exports = getTrend