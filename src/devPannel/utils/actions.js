export const GET_STORE_VALUE = 'window.MissEvanEvents.getValue()'
export const EMIT_EVENT = (type, data) =>
  `window.MissEvanEvents.bus.emit('${type}', ...${data || '[]'})`
export const UPDATE_STORE = (objString) =>
  `window.MissEvanEvents.next((state) => (${objString}))`
export const UPDATE_JTL_DOM = (type, jsUrl, cssUrl) =>
  `window.updateJtlDom('${type}', '${jsUrl}', '${cssUrl}')`
