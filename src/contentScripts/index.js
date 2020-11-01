import {
  MESSAGE_DATA_TYPE,
  MESSAGE_SOURCE,
  MISSEVAN_JTL_UPDATE_TYPE,
  MISSEVAN_DEVTOOLS_CONTENT_NAME,
} from '../devPannel/utils/constants'

function MissEvanDevToolsContent(props) {
  // 向 background 发送消息
  function sendMessage(type, payload) {
    window.postMessage({ source: this.MESSAGE_SOURCE.PAGE, type, payload }, '*')
  }

  // 替换 bus.emit，监听所有发布的事件
  function rewriteMissEvanEventsBusEmit() {
    const _emit = window.MissEvanEvents.bus.emit
    window.MissEvanEvents.bus._emit = _emit
    // 发布事件前和 background 同步一下
    window.MissEvanEvents.bus.emit = (type, ...args) => {
      this.sendMessage(this.MESSAGE_DATA_TYPE.EVENT, { type, data: args })
      window.MissEvanEvents.bus._emit(type, ...args)
    }
  }

  // 订阅数据流
  function subscribeMissEvanEventsData() {
    window.MissEvanEvents.obs.subscribe((data) => {
      this.sendMessage(this.MESSAGE_DATA_TYPE.DATA, data)
    })
  }

  // 添加，删除，更新加特林
  function updateJtlDom(type, jsUrl, cssUrl) {
    const jsDom =
      window[this.MISSEVAN_DEVTOOLS_CONTENT_NAME].MISSEVAN_JTL_JS ||
      document.createElement('script')
    const cssDom =
      window[this.MISSEVAN_DEVTOOLS_CONTENT_NAME].MISSEVAN_JTL_CSS ||
      document.createElement('link')
    function _add() {
      jsDom.src = jsUrl
      cssDom.href = cssUrl
      document.head.appendChild(cssDom)
      document.body.appendChild(jsDom)
    }
    function _del() {
      try {
        document.head.removeChild(cssDom)
        document.body.removeChild(jsDom)
      } catch (e) {}
    }
    switch (type) {
      case this.MISSEVAN_JTL_UPDATE_TYPE.ADD: {
        _del()
        _add()
        break
      }
      case this.MISSEVAN_JTL_UPDATE_TYPE.DEL: {
        _del()
        break
      }
    }
  }

  // 初始化 MissEvanEvents 的拦截和订阅
  function initMissEvan() {
    try {
      this.rewriteMissEvanEventsBusEmit()
      this.subscribeMissEvanEventsData()
      this.sendMessage(this.MESSAGE_DATA_TYPE.INIT)
    } catch (e) {
      this.sendMessage(this.MESSAGE_DATA_TYPE.INIT_ERROR)
    }
  }

  function getProperties(data) {
    return Object.keys(data).map((key) => ({
      key,
      value: data[key],
    }))
  }

  function defineProperties(target, data) {
    const properties = getProperties(data)
    properties.forEach((v) => {
      const descriptor = v
      descriptor.enumerable = true
      Object.defineProperty(target, v.key, descriptor)
    })
  }

  const functions = {
    sendMessage,
    rewriteMissEvanEventsBusEmit,
    subscribeMissEvanEventsData,
    updateJtlDom,
    initMissEvan,
  }
  const missEvanDevToolsContent = {}
  defineProperties(missEvanDevToolsContent, props)
  defineProperties(missEvanDevToolsContent, functions)
  missEvanDevToolsContent.initMissEvan()
  return missEvanDevToolsContent
}

// 摆脱安全限制，将函数注入到页面
function insertScripts(text) {
  const script = document.createElement('script')
  script.text = text
  document.body.appendChild(script)
  document.body.removeChild(script)
}

function generateMissEvanContentProps() {
  const props = {
    MESSAGE_DATA_TYPE: MESSAGE_DATA_TYPE,
    MESSAGE_SOURCE: MESSAGE_SOURCE,
    MISSEVAN_JTL_UPDATE_TYPE: MISSEVAN_JTL_UPDATE_TYPE,
    MISSEVAN_DEVTOOLS_CONTENT_NAME: MISSEVAN_DEVTOOLS_CONTENT_NAME,
  }
  return JSON.stringify(props)
}

const codeTemplate = `
  ${MissEvanDevToolsContent}
  (function(){
    const missEvanDevToolsContent = new MissEvanDevToolsContent(${generateMissEvanContentProps()})
    window[missEvanDevToolsContent.MISSEVAN_DEVTOOLS_CONTENT_NAME] = missEvanDevToolsContent
  })()
`
insertScripts(codeTemplate)

// 监听页面内的消息发送给 background
window.addEventListener('message', (e) => {
  if (e.data && e.data.source === MESSAGE_SOURCE.PAGE) {
    chrome.runtime.sendMessage(e.data)
  }
})
