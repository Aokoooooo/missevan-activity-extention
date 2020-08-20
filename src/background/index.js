// OnInstall handler
chrome.runtime.onInstalled.addListener(details => {
  console.log(details)
})

console.log(window.MissEvanEvents)
setTimeout(() => {
  console.log(window.MissEvanEvents)
  const _emit = window.MissEvanEvents.bus.emit
  window.MissEvanEvents.bus.emit = (type, ...args) => {
    console.log(type, ...args)
    _emit(type, ...args)
  }
  window.MissEvanEvents.test = true
}, 1000)
