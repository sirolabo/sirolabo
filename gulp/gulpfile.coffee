debug = true
#=============================================================================
# define
#=============================================================================
#-----------------------------------------------------------------------------
# require
#-----------------------------------------------------------------------------
gulp = require('gulp')
myTask = require('./myTask')
cp = require('child_process')

#-----------------------------------------------------------------------------
# path
#-----------------------------------------------------------------------------
path = {}
path.root = "../"
path.code = path.root + "code/"
path.webroot = path.root + "webroot/"
path.public = path.webroot + "public/"
path.server = 
  watch: path.root + "server/"
  dest: path.root
path.css = 
  watch: path.code + "css/"
  dest: path.public + "css/"
path.js = 
  watch: path.code + "js/"
  dest: path.public + "js/"
path.views = 
  watch: path.code + "views/"
  dest: path.webroot

#-----------------------------------------------------------------------------
# watchList
#-----------------------------------------------------------------------------
watchList = {
  jade: {
    taskName: "jade"
    pathList_watch: [path.views.watch + '**/*.jade']
  }
  stylus: {
    taskName: "stylus"
    pathList_watch: [path.css.watch + '**/*.styl']
  }
  coffee: {
    taskName: "coffee"
    pathList_watch: [path.js.watch + '**/*.coffee']
  }
  server: {
    taskName: "server"
    pathList_watch:[path.server.watch + 'server.coffee']
  }
}

#=============================================================================
# task
#=============================================================================
#-----------------------------------------------------------------------------
# server
#-----------------------------------------------------------------------------
gulp.task('server', ->
  myTask.server(
      [path.server.watch + "server.coffee"]
    , path.server.dest
  )
)

#-----------------------------------------------------------------------------
# stylus
#-----------------------------------------------------------------------------
gulp.task('stylus', ->
  myTask.stylus(
      [path.css.watch + 'style.styl']
    , path.css.dest
  )
)

#-----------------------------------------------------------------------------
# default
#-----------------------------------------------------------------------------
gulp.task('default', ->
  myTask.watch(watchList)
)

#-----------------------------------------------------------------------------
# jade
#-----------------------------------------------------------------------------
gulp.task('jade', ->
  myTask.jade(
      [path.views.watch + '**/[^_]*.jade']
    , path.views.dest
  )
)

#-----------------------------------------------------------------------------
# coffee
#-----------------------------------------------------------------------------
gulp.task('coffee', ->
  myTask.coffee(
      [path.js.watch + "main.coffee"]
    , path.js.dest
  )
)

#-----------------------------------------------------------------------------
# liveScript
#-----------------------------------------------------------------------------
gulp.task('liveScript', ->
  myTask.liveScript(
      [path.code + "ls/main.ls"]
    , path.src + "js/"
  )
)

#-----------------------------------------------------------------------------
# coffeeDoc
#-----------------------------------------------------------------------------
gulp.task('coffeeDoc', ->
  myTask.coffee(
      ["../doc/main.coffee"]
    , "../doc/"
  )
)

#-----------------------------------------------------------------------------
# jsduck
#-----------------------------------------------------------------------------
gulp.task('jsduck', ->
  cp.exec('jsduck ../doc/main.js --output ../doc/html/ --title "websrc document"')
)