// 替换 bus.emit，监听所有发布的事件
function rewriteMissEvanEventsBusEmit() {
  const _emit = window.MissEvanEvents.bus.emit
  window.MissEvanEvents.bus._emit = _emit
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

function initMissEvan() {
  if (!window.MissEvanEvents || window.MissEvanEvents._extension_init) {
    return
  }
  rewriteMissEvanEventsBusEmit()
  subscribeMissEvanEventsData()
  window.MissEvanEvents._extension_init = true
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

// 监听页面内的消息发送给 background
window.addEventListener('message', (e) => {
  if (e.data && e.data.source === 'MissEvanActivityPage') {
    chrome.runtime.sendMessage(e.data)
  }
})