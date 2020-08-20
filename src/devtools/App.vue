<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Welcome!DevTools'
    }
  },
  mounted() {
    this.createPanel('devPannel.html')
  },
  methods: {
    createPanel(url) {
      chrome.devtools.panels.create(
        'MissEvan', 'assets/icons/icon_64.png', url);
    }
  }
}
</script>

<style lang="scss">
</style>
