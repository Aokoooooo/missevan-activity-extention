import { MISSEVAN_PANNEL_NAME } from '../devPannel/utils/constants'

// 创建 devtools 面板
function createPanel(url) {
  chrome.devtools.panels.create(MISSEVAN_PANNEL_NAME, null, url)
}
// 只有我方域名下才会创建 MissEvan 面板
chrome.devtools.inspectedWindow.eval(
  '(function(){ return this.location.host })()',
  (r, e) => {
    if (e) {
      console.log(e)
      return
    }
    if (r.endsWith('.missevan.com') || r.endsWith('.bilibili.com')) {
      createPanel('devPannel.html')
    }
  }
)
