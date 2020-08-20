import { MISSEVAN_PANNEL_NAME } from '../devPannel/utils/constants'

// 创建 devtools 面板
function createPanel(url) {
  chrome.devtools.panels.create(MISSEVAN_PANNEL_NAME, null, url)
}

createPanel('devPannel.html')
