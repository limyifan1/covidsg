let date = new Date('2020-04-12T21:55:04.136Z')
let day = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
// console.log(day[date.getDay()])
// console.log(date.toLocaleDateString('EN-SG'), date.toLocaleTimeString('EN-SG'))
date = date + parseInt(60*8)
console.log(date)