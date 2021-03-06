#==============================================================================
# require
#==============================================================================
debug = require("debug")
core  = require("core")
web   = require("web")
data  = require('./data')
css   = require("css")
event_trans      = require("event/trans")

#==============================================================================
# define
#==============================================================================
webeleSelect     = "BG"
responsiveName   = web.size.chooseResponsiveMax(web.size.getResponsiveName(), data.responsiveMax)
responsiveSelect = "small"
animationSelect  = "start"
allCSS           = ""

#==============================================================================
# init
#==============================================================================
exports.init = () ->
  init_colorPicker = () ->
    $('#colorpicker_webCustomizer').farbtastic('#colorInput_webCustomizer')
    $.farbtastic('#colorpicker_webCustomizer').setColor(core.calc.hslToRGB(data.HSL))
    data.colorList = web.color.getColorList(data.HSL)

  init_colorPicker()
  setTransOption()
  $("#responsiveMax_select").val(data.responsiveMax)
  $(window).trigger("resize")

setTransOption = (id, val) ->
  event_trans.option.method = data.gui_option.trans.method.val
  event_trans.option.time = data.gui_option.trans.time.val
  data.gui_option.trans.method.setGuiVal()
  data.gui_option.trans.time.setGuiVal()

setGuiData = (id, val) ->
  resData = [responsiveSelect]
  animeData = [animationSelect]
  if $("#resAll_checked:checked").val()
    resData = data.responsiveList
  if $("#animAll_checked:checked").val()
    animeData = data.animationState
  idList = id.split("_")
  for key_res in resData
    for key_anime in animeData
      webeleData = data.webele[key_res][webeleSelect][key_anime]
      if idList.indexOf("all") == -1
        for key in idList
          webeleData = webeleData[key]
        webeleData.val = val
      else
        for index, param of core.obj.parallelLoop(webeleData, idList, idList.indexOf("all"))
          param.val = val
          param.setGuiVal()
  setCSS()

#==============================================================================
# initEvent
#==============================================================================
core.obj.allCall(data.gui_css, {key:"initEvent", arg:[{method:setGuiData, arg:[]}]})
core.obj.allCall(data.gui_option, {key:"initEvent", arg:[{method:setTransOption, arg:[]}]})

$('*').bind 'contextmenu', (e) =>
  if $(e.currentTarget).data(data.name)
    webeleSelect = $(e.currentTarget).data(data.name)
  else
    webeleSelect = $(e.currentTarget).parents("[data-" + data.name + "]").data(data.name)
  setData()
  false

$(window).resize (e) =>
  responsiveSelect = web.size.chooseResponsiveMax(web.size.getResponsiveName(), data.responsiveMax)
  $("#responsive_input").val(responsiveSelect)
  #debug.test.startTimer("test")
  setData()
  setCSS()
  #debug.test.endTimer("test")

$("#webeleName_input").change (e) =>
  webeleSelect = $(e.currentTarget).val()
  setData()

$("#animationState_select").change (e) =>
  animationSelect = $(e.currentTarget).val()
  setData()

$("#responsiveMax_select").change (e) =>
  data.responsiveMax = $(e.currentTarget).val()
  $(window).trigger("resize")

$('#colorInput_webCustomizer').bind 'change', (event) =>
  getHSL = () -> 
    hslSprit = $("#colorInput_webCustomizer").val().split("_")[0].split(":")
    if hslSprit[0] == "NaN" || hslSprit[1] == "NaN" || hslSprit[2] == "NaN"
      return
    
    return  {
      H: Number(hslSprit[0])
      S: Number(hslSprit[1])
      L: Number(hslSprit[2])
    }
  data.HSL = getHSL()
  data.colorList = web.color.getColorList(data.HSL)
  setCSS()

#----------------------------------------------------------------------------
# pageSave
#----------------------------------------------------------------------------
$("#page_save").click (event) =>
  data.setCookie()
  alert("ページキャッシュに保存しました。")

#----------------------------------------------------------------------------
# pageClear
#----------------------------------------------------------------------------
$("#page_clear").click (event) =>
  data.clearCookie()
  alert("ページキャッシュをクリアしました。")

#----------------------------------------------------------------------------
# g Save
#----------------------------------------------------------------------------
$("#global_save").click (event) =>
  data.setCookie_G()
  alert("グローバルキャッシュに保存しました。")

#----------------------------------------------------------------------------
# g Clear
#----------------------------------------------------------------------------
$("#global_clear").click (event) =>
  data.clearCookie_G()
  alert("グローバルキャッシュをクリアしました。")
  
#----------------------------------------------------------------------------
# Generate
#----------------------------------------------------------------------------
$("#generateCodes").click (event) =>
   console.log allCSS
   alert("コンソールにコードを出力しました。")

#----------------------------------------------------------------------------
# save as file
#----------------------------------------------------------------------------
$("#saveAsFile").click (event) =>
   data.saveFile()

#----------------------------------------------------------------------------
# save as file
#----------------------------------------------------------------------------
$("#loadFromFile").click (event) =>
  console.log("サーバデータをロードします。")
　 data.loadFile()

$("#commonSave").click (event) =>
　 data.commonSave()
  alert("共通データを保存しました。")

$("#commonLoad").click (event) =>
　 data.commonLoad()
  alert("共通データをロードしました。")

#----------------------------------------------------------------------------
# bkSave
#----------------------------------------------------------------------------
$("#saveBKFile").click (event) =>
   data.saveBKFile()

#----------------------------------------------------------------------------
# save as file
#----------------------------------------------------------------------------
$("#loadBKFile").click (event) =>
   $("#loader").click()

#----------------------------------------------------------------------------
# loadFromFile
#----------------------------------------------------------------------------
loadFromFile = (e, parent) =>
  JsonObj = JSON.parse(e.target.result)
  data.gui_css = JsonObj.gui_css
  data.webele = JsonObj.webele
  data.HSL = JsonObj.HSL
  data.gui_option    = JsonObj.gui_option
  data.optionData = JsonObj.optionData
  data.responsiveMax = JsonObj.responsiveMax

  @init()

core.file.registFileAPI("#loader", loadFromFile, this)


#==============================================================================
# setData
#==============================================================================
setData = () ->
  $("#webeleName_input").val(webeleSelect)
  core.obj.allCall(data.webele[responsiveSelect][webeleSelect][animationSelect], {key:"setGuiVal", arg:[]})
  core.obj.allCall(data.optionData, {key:"setGuiVal", arg:[]})

#==============================================================================
# setCSS
#==============================================================================
setCSS = () ->
  getVal = (valData) ->
    if valData then return valData else return ""

  getValPX = (valData) ->
    if valData then return valData + "px" else return ""

  getColor = (colorData) ->
    if colorData.colorName.val && colorData.tone.val
      return data.colorList[colorData.colorName.val][colorData.tone.val]
    else 
      ""
  getUnitVal = (unitData) ->
    if unitData.unit.val
      if unitData.unit.val != "%" && unitData.unit.val != "px"
        return unitData.unit.val
      else
        return unitData.num.val + unitData.unit.val if unitData.num.val
    return ""

  setCSSStr = (cssData) ->
    cssStr = cssData.make()
    if cssStr != ""
      css.core.setRule(cssStr)
    allCSS += cssStr

  css.core.deleteAllRule()
  allCSS = ""
  for key_res in data.responsiveList
    for webele in data.webeleList
      continue if web.size.chooseResponsiveMax(key_res, data.responsiveMax) != key_res
      for anime in data.animationState
        cssData = data.css[key_res][webele][anime].main
        webeleData = data.webele[key_res][webele][anime]

        continue if anime == "end" && !webeleData.animation.trigger.val

        #animation
        if anime == "start"
          cssData.animation.time = getVal webeleData.animation.time.val
        if anime != "start"
          cssData.animation.trigger = getVal webeleData.animation.trigger.val
        #bg
        cssData.background.color = getColor(webeleData.background.color)
        if getVal webeleData.background.image.val
          cssData.background.image = "../img/imageList/" + getVal webeleData.background.image.val
        else
          cssData.background.image = ""

        cssData.background.repeat = getVal webeleData.background.repeat.val
        cssData.background.attachment = getVal webeleData.background.attachment.val
        if webeleData.background.grdDirection.val
          if webeleData.background.grdDirection.val == "circle"
            cssData.background.gradation = 
              "radial-gradient("
          else
            cssData.background.gradation = 
              "linear-gradient(to "
          cssData.background.gradation +=
            webeleData.background.grdDirection.val + ", " +
            getColor(webeleData.background.grdColor[1]) + " " + webeleData.background.grdPercent.val[0] + "%, " +
            getColor(webeleData.background.grdColor[2]) + " " + webeleData.background.grdPercent.val[1] + "%, " +
            getColor(webeleData.background.grdColor[3]) + " 100%)"
        else
          cssData.background.gradation = ""

        switch webeleData.background.size.x.unit.val
          when "contain", "cover"
            cssData.background.size = webeleData.background.size.x.unit.val
          else
            if webeleData.background.size.x.num.val
              cssData.background.size = 
                getUnitVal(webeleData.background.size.x) + " " + getUnitVal(webeleData.background.size.y)
            else
              cssData.background.size = ""

        if webeleData.background.direction.x.val
          cssData.background.position = 
            webeleData.background.direction.x.val + " " + getUnitVal(webeleData.background.coord.x) + " " +
            webeleData.background.direction.y.val + " " + getUnitVal(webeleData.background.coord.y)
        else
          cssData.background.position = ""

        #border
        for section in ["left", "top", "right", "bottom"]
          if webeleData.border[section].style.val
            cssData.border[section] = 
              webeleData.border[section].style.val + " " + 
              webeleData.border[section].width.val + "px " + 
              getColor(webeleData.border[section].color) 
          else
            cssData.border[section] = ""

        #rule
        cssData.rule.important =  getVal webeleData.rule.important.val

        #radius
        if webeleData.borderRadius.topLeft.val != 0 or 
           webeleData.borderRadius.topRight.val != 0 or 
           webeleData.borderRadius.bottomLeft.val != 0 or 
           webeleData.borderRadius.bottomRight.val != 0
          cssData.radius.radius =
            webeleData.borderRadius.topLeft.val + "px " + 
            webeleData.borderRadius.topRight.val + "px " + 
            webeleData.borderRadius.bottomLeft.val + "px " + 
            webeleData.borderRadius.bottomRight.val + "px"
        else
          cssData.radius.radius = ""
        #font
        cssData.font.family = getVal webeleData.font.family.val
        cssData.font.size = getValPX webeleData.font.size.val
        cssData.font.lineHeight = getUnitVal(webeleData.font.lineHeight)
        cssData.font.weight = getVal webeleData.font.weight.val
        cssData.font.align = getVal webeleData.font.align.val
        cssData.font.color = getColor(webeleData.font.fontColor)
        cssData.font.decoration = getVal webeleData.font.decoration.val
        if webeleData.font.shadow1.x.val != 0 or
           webeleData.font.shadow1.y.val != 0 or
           webeleData.font.shadow1.shade.val != 0
          cssData.font.shadow = 
            webeleData.font.shadow1.x.val + "px " + webeleData.font.shadow1.y.val + "px " + webeleData.font.shadow1.shade.val + "px " + getColor(webeleData.font.shadow1.color) + ", " +
            webeleData.font.shadow2.x.val + "px " + webeleData.font.shadow2.y.val + "px " + webeleData.font.shadow2.shade.val + "px " + getColor(webeleData.font.shadow2.color) + ", " +
            webeleData.font.shadow3.x.val + "px " + webeleData.font.shadow3.y.val + "px " + webeleData.font.shadow3.shade.val + "px " + getColor(webeleData.font.shadow3.color) + ", " +
            webeleData.font.shadow4.x.val + "px " + webeleData.font.shadow4.y.val + "px " + webeleData.font.shadow4.shade.val + "px " + getColor(webeleData.font.shadow4.color)

        #opacity
        cssData.opacity.opacity = getVal webeleData.opacity.opacity.val

        #position
        cssData.position.position   = getVal webeleData.position.position.val
        cssData.position.display    = getVal webeleData.position.display.val
        cssData.position.zIndex     = getVal webeleData.position.zIndex.val
        cssData.position.float      = getVal webeleData.position.float.val
        cssData.position.clear      = getVal webeleData.position.clear.val
        cssData.position.whiteSpace = getVal webeleData.position.whiteSpace.val
        cssData.position.overflow.x = getVal webeleData.position.overflow.x.val
        cssData.position.overflow.y = getVal webeleData.position.overflow.y.val
        cssData.position.top        = getUnitVal(webeleData.position.top)       
        cssData.position.left       = getUnitVal(webeleData.position.left)
        cssData.position.bottom     = getUnitVal(webeleData.position.bottom)
        cssData.position.right      = getUnitVal(webeleData.position.right)

        #boxShadow
        if webeleData.boxShadow.x.val != 0 or
           webeleData.boxShadow.y.val != 0 or
           webeleData.boxShadow.shade.val != 0 or
           webeleData.boxShadow.size.val != 0
          cssData.boxShadow.boxShadow = 
            webeleData.boxShadow.x.val + "px " + webeleData.boxShadow.y.val + "px " + webeleData.boxShadow.shade.val + "px " + webeleData.boxShadow.size.val + "px " + getColor(webeleData.boxShadow.color) +  " " + webeleData.boxShadow.inset.val
        else
          cssData.boxShadow.boxShadow = ""

        #size
        for section in ["normal", "min", "max"]
          cssData.size[section].width = getUnitVal(webeleData.size[section].width)
          cssData.size[section].height = getUnitVal(webeleData.size[section].height)

        #space
        for section in ["left", "top", "right", "bottom"]
          cssData.space[section].margin = getUnitVal(webeleData.space[section].margin)
          cssData.space[section].padding = getUnitVal(webeleData.space[section].padding)

        #transform
        if webeleData.transform.rotate.x.val or
           webeleData.transform.rotate.y.val or
           webeleData.transform.rotate.z.val or
           webeleData.transform.scale.val != 1 or
           webeleData.transform.skew.x.val or
           webeleData.transform.skew.y.val or
           webeleData.transform.translate.x.val or
           webeleData.transform.translate.y.val
          cssData.transform.transform =
            "rotate3d(1,0,0," + webeleData.transform.rotate.x.val + "deg) " + 
            "rotate3d(0,1,0," + webeleData.transform.rotate.y.val + "deg) " + 
            "rotate3d(0,0,1," + webeleData.transform.rotate.z.val + "deg) " + 
            "scale(" + webeleData.transform.scale.val + ") " + 
            "skew(" + webeleData.transform.skew.x.val + "deg, " + webeleData.transform.skew.y.val+ "deg) " + 
            "translate(" + webeleData.transform.translate.x.val + "px, " + webeleData.transform.translate.y.val+ "px)"
        else
          cssData.transform.transform = ""
        if webeleData.transform.origin.x.val or
           webeleData.transform.origin.y.val
          cssData.transform.origin =
            webeleData.transform.origin.x.val + "% " + webeleData.transform.origin.y.val + "%"
        else
          cssData.transform.origin = ""

        setCSSStr(cssData)

        if getColor(webeleData.font.linkColor.normal)
          cssData = data.css[key_res][webele][anime].link
          cssData.animation.time = getVal webeleData.animation.time.val
          cssData.animation.trigger = ""
          cssData.font.color = getColor(webeleData.font.linkColor.normal)
          setCSSStr(cssData)

          cssData.animation.time = ""
          cssData.animation.trigger = "hover"
          cssData.font.color = getColor(webeleData.font.linkColor.hover)
          setCSSStr(cssData)