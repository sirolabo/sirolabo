###*
  @class web.url
    url関連の操作を行います。
###
core = require("core")

#==============================================================================
# method
#==============================================================================
###*
  @method getPageName
  urlからページ名を取得します。
###
exports.getPageName = () ->
  name = location.href.split("/")[location.href.split("/").length-1].split(".")[0].split("#")[0]
  name = "index" if name == ""
  name