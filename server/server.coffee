###
	require
###
r = {}
require('node-monkey').start({host: "127.0.0.1", port:"50500"})
r.express  = require('express')
r.logger   = require('morgan')
r.http     = require("http")
r.path     = require("path")
r.fs       = require("fs")
r.socketIO = require('socket.io')
r.jade     = require('jade')

global.rootRequire = (name) ->
	return require(__dirname + '/' + name)

###
	define
###
app = r.express()
path =
	views: __dirname + "/code/views/"
	public: "webroot/public/"

###
	config
###
app.set('port', process.env.PORT || 1234)
app.set('view engine', 'jade')
app.set('views', path.views)

###
	middleware
###
app.use(r.logger('dev'))
#app.use(r.express.favicon(localPath + 'favicon.ico'))
app.use('/public', r.express.static(r.path.join(__dirname, path.public)))
# app.use('/webSrc', r.express.static(r.path.join(__dirname, 'src/')))
# app.use('/public', r.express.static(path.public))
app.use((err, req, res, next)->
	console.error(err.stack)
	res.send(500, 'Fatal Error')
)

###
	server
###
server = r.http.createServer(app)
server.listen(app.get("port"), ()->
  console.log("Express server listening on port " + app.get("port"))
) 

io = r.socketIO.listen(server)
io.on('connection', (socket) ->
	###
		file
	###
	socket.on('fs_write', (param)->
		r.fs.writeFile(param.fileName, param.data, (err) ->
			console.log err
		)
	)

	socket.on('fs_load', (param)->
		r.fs.readFile(param.fileName, (err, fileData) ->
			console.log err if err
			io.sockets.emit param.id + '_end', JSON.parse(fileData)
		)
	)
)

###
	router
###
app.get('/*', (req, res) ->
	param = {}
	param.load =
		cssEditor: true
		canvasEditor: false
	
	if req.params[0] then viewName = req.params[0] else viewName = "index"
	res.render(
		app.get("views") + viewName + ".jade"
		{
			filename: req.params[0]
			pretty: true
			debug:true
			node: param
		}
		(err, html) ->
			if err
				res.send err
				res.send("404 file not found")
			else
				res.end(html)
	)
)