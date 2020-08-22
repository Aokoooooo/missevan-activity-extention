import { MISS_EVAN_PANNEL_NAME } from '../utils/constants'

// 创建 devtools 面板
function createPanel(url) {
  chrome.devtools.panels.create(MISS_EVAN_PANNEL_NAME, null, url)
}

createPanel('devPannel.html')
