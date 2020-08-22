const connections = {}
const getPortId = (port) => {
  return port.name.split('-')[1] || ''
}
// 和 devtools 建立连接
chrome.runtime.onConnect.addListener(function (port) {
  // 连接名必须为 MissEvanDevTools-tabID
  if (!port.name.startsWith('MissEvanDevTools')) {
    return
  }
  const tabId = getPortId(port)
  if (!tabId) {
    return
  }
  // 缓存连接
  connections[tabId] = port
  // 打印所有来自 devtools 的消息
  const extensionListener = function (message) {
    if (message.source === 'MissEvanDevTools') {
      console.log(message)
    }
  }
  // 监听 devtools 的消息
  port.onMessage.addListener(extensionListener)
  // 连接关闭后移除监听和缓存
  port.onDisconnect.addListener(function (port) {
    port.onMessage.removeListener(extensionListener)
    const tabId = getPortId(port)
    if (tabId && tabId in connections) {
      delete connections[tabId]
    }
  })
})

// 监听 contentScripts 的消息
chrome.runtime.onMessage.addListener((message, sender) => {
  if (sender.tab) {
    const tabId = sender.tab.id
    if (tabId in connections) {
      // 将消息转发给对应的 devtools
      if (message.source === 'MissEvanActivityPage') {
        connections[tabId].postMessage(message)
      }
    } else {
      console.log('Tab not found in connection list.')
    }
  } else {
    console.log('sender.tab not defined.')
  }
  return true
})
