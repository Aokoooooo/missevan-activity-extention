
const connections = {}
chrome.runtime.onConnect.addListener(function (port) {
  if (!port.name.startsWith('MissEvanDevTools')) {
    return
  }
  const tabId = port.name.split('-')[1] || ''
  if (!tabId) {
    return
  }
  connections[tabId] = port
  const extensionListener = function (message) {
    if (message.name === 'MissEvanDevTools') {
      connections[message.tabId] = port
    }
  }
  port.onMessage.addListener(extensionListener)
  port.onDisconnect.addListener(function (port) {
    port.onMessage.removeListener(extensionListener)
    const tabs = Object.keys(connections)
    for (let i = 0, len = tabs.length; i < len; i++) {
      if (connections[tabs[i]] === port) {
        delete connections[tabs[i]]
        break
      }
    }
  })
})

chrome.runtime.onMessage.addListener((message, sender) => {
  if (sender.tab) {
    const tabId = sender.tab.id
    if (tabId in connections) {
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
