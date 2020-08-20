<template>
  <div>
    <h1>{{ msg }}</h1>
    <h1>{{ tabId }}</h1>
    <div @click="onClick">点我</div>
    <div @click="onClick2">点我2</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Welcome!DevPannel',
      missEvan: JSON.stringify(window.MissEvanEvents),
      tabId: chrome.devtools.inspectedWindow.tabId,
    }
  },
  mounted() {
    bgConnection = chrome.runtime.connect({ name: id ? id.toString() : undefined });
    bgConnection.onMessage.addListener(message => {
      console.log(message)
   });
   this.onClick2()
    chrome.devtools.inspectedWindow.eval('window.MissEvanEvents.test = 1')
  },
  methods: {
    onClick(){
      chrome.devtools.inspectedWindow.eval('console.log(window.MissEvanEvents.getValue())')
   },
   onClick2(){
      chrome.devtools.inspectedWindow.eval('cosnt _emit = window.MissEvanEvents.bus.emit;window.MissEvanEvents.bus.emit = (type, ...args) => {console.log(args);_emit(type, ...args)}')
   },
  }
}
</script>

<style lang="scss">
</style>
