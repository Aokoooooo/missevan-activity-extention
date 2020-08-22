// 替换 bus.emit，监听所有发布的事件
function rewriteMissEvanEventsBusEmit() {
  const _emit = window.MissEvanEvents.bus.emit
  window.MissEvanEvents.bus._emit = _emit
  // 发布事件前和 background 同步一下
  window.MissEvanEvents.bus.emit = function (type, ...args) {
    window.postMessage(
      {
        source: 'MissEvanActivityPage',
        type: 'missevan-event-bus',
        payload: { type, data: args },
      },
      '*'
    )
    window.MissEvanEvents.bus._emit(type, ...args)
  }
}

// 订阅数据流
function subscribeMissEvanEventsData() {
  window.MissEvanEvents.obs.subscribe((data) => {
    window.postMessage(
      {
        source: 'MissEvanActivityPage',
        type: 'missevan-event-data',
        payload: data,
      },
      '*'
    )
  })
}

// 添加，删除，更新加特林
function updateJtlDom(type, jsUrl, cssUrl) {
  if (!window.MISSEVAN_JTL_JS) {
    window.MISSEVAN_JTL_JS = document.createElement('script')
    window.MISSEVAN_JTL_JS.type = 'text/javascript'
  }
  if (!window.MISSEVAN_JTL_CSS) {
    window.MISSEVAN_JTL_CSS = document.createElement('link')
    window.MISSEVAN_JTL_CSS.rel = 'stylesheet'
  }
  function _add() {
    window.MISSEVAN_JTL_JS.src = jsUrl
    window.MISSEVAN_JTL_CSS.href = cssUrl
    document.head.appendChild(window.MISSEVAN_JTL_CSS)
    document.body.appendChild(window.MISSEVAN_JTL_JS)
  }
  function _del() {
    try {
      document.head.removeChild(window.MISSEVAN_JTL_CSS)
      document.body.removeChild(window.MISSEVAN_JTL_JS)
    } catch (e) {}
  }
  switch (type) {
    case 'ADD': {
      _del()
      _add()
      break
    }
    case 'DEL': {
      _del()
      break
    }
    default:
      break
  }
}

// 初始化 MissEvanEvents 的拦截和订阅
function initMissEvan() {
  // 当前页面没有 MissEvanEvents 对象
  if (!window.MissEvanEvents) {
    return
  }
  rewriteMissEvanEventsBusEmit()
  subscribeMissEvanEventsData()
}

// 摆脱安全限制，将函数注入到页面
function insertScripts(text) {
  const script = document.createElement('script')
  script.text = text
  document.body.appendChild(script)
}

insertScripts(rewriteMissEvanEventsBusEmit.toString())
insertScripts(subscribeMissEvanEventsData.toString())
insertScripts(`${initMissEvan}\ninitMissEvan()`)
insertScripts(updateJtlDom.toString())

// 监听页面内的消息发送给 background
window.addEventListener('message', (e) => {
  if (e.data && e.data.source === 'MissEvanActivityPage') {
    chrome.runtime.sendMessage(e.data)
  }
})
