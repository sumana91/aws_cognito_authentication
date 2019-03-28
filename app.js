var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var routes = require('./controllers/routes')
var app = express()
var port = 8009

app.use(bodyParser.json())
app.set('view engine', 'ejs')

// Public Folder
app.use(express.static('./public'))

app.use('/user', routes)

app.listen(port, function (){
	console.log("Listening on", port)
})

module.exports = app
