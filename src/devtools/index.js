import { MISS_EVAN_PANNEL_NAME } from '../utils/constants'

function createPanel(url) {
  chrome.devtools.panels.create(MISS_EVAN_PANNEL_NAME, null, url)
}

createPanel('devPannel.html')
