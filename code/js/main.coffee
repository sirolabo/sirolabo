global.isLocalTest = true
global.serverURL = "http://test1-sirolabo.rhcloud.com/"

#==============================================================================
# require
#==============================================================================
require("cssEditor")
require("event/com").init()
# event_trans = require("event/trans")

#==============================================================================
# const
#==============================================================================
# if !debug
#   event_trans.option.method = ""
#   event_trans.option.time = ""

# preImageList = [
#   'bg/body.png'
#   'bg/contents.png'
#   'plugins/bootstrap/carousel/1.jpg'
#   'plugins/bootstrap/carousel/2.jpg'
# ]

# #==============================================================================
# # event
# #==============================================================================
# $(window).load ->
#   if !event_trans.check_access()
#     event_trans.preLoading(preImageList, event_trans.in())
#   else
#     event_trans.in()

# $("a").click ->
#   if event_trans.check_anker(this)
#     event_trans.out($(this).attr('href'))