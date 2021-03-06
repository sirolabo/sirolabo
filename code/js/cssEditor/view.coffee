data = require('./data')
html = require('html')
web = require('web')

#==============================================================================
# exports
#==============================================================================
getHeader = (id, iconName, domList) ->
  dom = [
    ["div", {id:id, class:"webCustomizer box_accordion draggable"}]
    [
      ["div", {class: "trigger fixed"}]
      [
        html.dom.icon(id + "Icon", iconName, "fa-2x")
      ]
      ["div", {class: "contents"}]
      domList
    ]
  ]
  dom

makeGui = (guiObj) ->
  makeContents = (dataParam) ->
    dom = []
    for key, param of dataParam
      if !param.name
        dom.push.apply(dom,
          [
            ["td", {class:"sub", colspan:"3"}, key]
            makeContents(param)
          ]
        )
      else
        getGuiDom = (param, attr={}) ->
          tempDom = []
          switch param.name
            when "slider"
              slider = param.makeDom()
              tempDom =
                [
                  [
                    slider.slider
                    ["span"]
                    slider.input
                  ]
                ]
            when "selectBox"
              tempDom =
                [
                  param.makeDom()
                ]
          tempDom

        dom_gui = [["td"]]
        if param.name == "unitSlider" or param.name == "color"
          for subKey, subParam of param
            dom_gui.push.apply(dom_gui, getGuiDom(subParam))              
        else
          dom_gui.push.apply(dom_gui, getGuiDom(param))
        dom.push.apply(dom,
          [
            ["tr"]
            [
              ["td", {}, key]
            ]
            dom_gui
          ]
        )
    dom

  dom = []
  for key, param of guiObj
    dom.push.apply(dom, [
      ["div", {id:key + "Setter" , class:"setterArea box_accordion"}]
        [
          ["div", {class:"trigger"}, key]
          ["div", {class: "contents"}]
          [
            ["table"]
            makeContents(param)
          ]
        ]
      ]
    )
  dom

getChanger = () ->
  getCSS = () ->
    getHeader("cssChanger", "edit",
      [
        ["div", {class: "headerArea"}]
        [
          ["div", {class: "headerFunction"}]
          [
            ["span", {}, "element"]
            html.dom.input("webeleName_input", 10, "none", "webeleName")
            ["span", {}, "anime"]
            html.dom.selectBox("animationState_select", data.animationState)
            ["span", {}, "all"]
            html.dom.checkbox("animAll_checked", "false")
          ]
          ["div", {class: "headerFunction"}]
          [
            ["span", {}, "responsive"]
            html.dom.input("responsive_input", 7, "exSmall")
            ["span", {}, "all"]
            html.dom.checkbox("resAll_checked", "true")
            ["span", {}, "max"]
            html.dom.selectBox("responsiveMax_select", data.responsiveList)
          ]
        ]
        ["div", {class: "contentsArea css"}]
        makeGui(data.gui_css)
      ]
    )

  getColorScheme = () ->
    getHeader("colorSchemeChanger", "tint",
      [
        ["div", {class: "headerArea"}]
        ["div", {class: "contentsArea"}]
        [
          ["div", {id: "colorpicker_webCustomizer"}]
          ["input", {id: "colorInput_webCustomizer", type: "text", value: "0:0:0_#000000"}]
        ]
      ]
    )

  getOption = () ->
    getHeader("optionChanger", "gear",
      [
        ["div", {class: "headerArea"}]
        ["div", {class: "contentsArea option"}]
        makeGui(data.gui_option)
      ]
    )

  getData = () ->
    getHeader("dataChanger", "save",
      [
        ["div", {class: "headerArea"}]
        ["div", {class: "contentsArea"}]
        [
          ["table"]
          [
            ["tr"]
            [
              ["td", {}, "serverData:"]
              ["td"]
              [
                ["button", {id: "saveAsFile", type: "button"}, "Save"]
              ]
              ["td"]
              [
                ["button", {id: "loadFromFile", type: "button"}, "Load"]
              ]
            ]
            ["tr"]
            [
              ["td", {}, "commonData:"]
              ["td"]
              [
                ["button", {id: "commonSave", type: "button"}, "Save"]
              ]
              ["td"]
              [
                ["button", {id: "commonLoad", type: "button"}, "Load"]
              ]
            ]
            ["tr"]
            [
              ["td", {}, "pageChash:"]
              ["td"]
              [
                ["button", {id: "page_save", type: "button"}, "Save"]
              ]
              ["td"]
              [
                ["button", {id: "page_clear", type: "button"}, "Clear"]
              ]
            ]
            ["tr"]
            [
              ["td", {}, "globalChash:"]
              ["td"]
              [
                ["button", {id: "global_save", type: "button", href: "data:test.txt"}, "Save"]
              ]
              ["td"]
              [
                ["button", {id: "global_clear", type: "button"}, "Clear"]
              ]
            ]
            ["tr"]
            [
              ["td", {}, "code:"]
              ["td"]
              [
                ["button", {id: "generateCodes", type: "button"}, "Generate"]
              ]
            ]
            ["tr"]
            [
              ["td", {}, "backup:"]
              ["td"]
              [
                ["button", {id: "saveBKFile", type: "button"}, "Save"]
              ]
              ["td"]
              [
                ["input", {id: "loader", class:"displayNone" , type: "file"}]
                ["button", {id: "loadBKFile", type: "button"}, "Load"]
              ]
            ]
          ]
        ]
      ]
    )

  dom = []
  dom.push.apply(dom, getCSS())
  dom.push.apply(dom, getColorScheme())  
  dom.push.apply(dom, getOption())
  dom.push.apply(dom, getData())
  dom
# console.log html.core.make(getChanger())
$("#webCustomizerArea").append(html.core.make(getChanger()))