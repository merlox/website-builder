const express = require('express')
const bodyParser = require('body-parser')
const { join } = require('path')
const app = express()
const port = 8000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('*', (req, res, next) => {
	// Logger
	let time = new Date()
	console.log(`${req.method} to ${req.originalUrl} at ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`)
	next()
})
// Compression request to send the valid build files
app.get('build.js', (req, res) => {
	if (req.header('Accept-Encoding').includes('br')) {
		res.set('Content-Encoding', 'br')
		res.set('Content-Type', 'application/javascript; charset=UTF-8')
		res.sendFile(path.join(__dirname, 'dist', 'build.js.br'))
	} else if(req.header('Accept-Encoding').includes('gz')) {
		res.set('Content-Encoding', 'gz')
		res.set('Content-Type', 'application/javascript; charset=UTF-8')
		res.sendFile(path.join(__dirname, 'dist', 'build.js.gz'))
	}
})
app.use(express.static('dist'))

app.listen(port, '0.0.0.0', (req, res) => {
	console.log(`Listening on localhost:${port}`)
})
