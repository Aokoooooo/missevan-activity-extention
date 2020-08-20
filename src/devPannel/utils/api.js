export const MISSEVAN_URL = {
  API_URL(uat) {
    return `https://www.${uat ? 'uat.' : ''}missevan.com`
  },
  JTL_URL(uat) {
    const jsUrl = uat
      ? 'https://static-test.missevan.com/standalone/uat/jiatelin/common.js'
      : 'https://static.missevan.com/standalone/jiatelin/common.js'
    const cssUrl = uat
      ? 'https://static-test.missevan.com/standalone/uat/jiatelin/common.css'
      : 'https://static.missevan.com/standalone/jiatelin/common.css'
    return { jsUrl, cssUrl }
  },
}

class ApiError extends Error {
  constructor(props) {
    const errorMsg = props.info || props.message || '未知错误'
    super(errorMsg)
    this.code = props.code
    this.success = false
    this.info = props.info
  }
}

function getResponse(response) {
  // 某些老接口没有 code 字段，只能通过头来判断是否需要登录（弹窗，并不会真的重定向）
  if (response.redirected && response.url.match(/\/member\/login/)) {
    throw new ApiError({
      code: ERROR_CODE.LOGIN_REQUIRED,
      message: '请先登录',
    })
  }
  return response.json().then((r) => {
    // 业务报错
    if (!r.success && r.code !== 0) {
      throw new ApiError({ ...r })
    }
    return r
  })
}

export function objectToUrlencode(obj) {
  let formdata = ''
  Object.keys(obj).forEach((k) => {
    if (formdata) {
      formdata += '&'
    }
    formdata += `${k}=${encodeURI(obj[k])}`
  })
  return formdata
}

export function URLProtocolRemove(url) {
  return url.replace(/^https?:/i, '')
}

/**
 * get 请求，then 中无需判断业务是否成功，业务失败请去 catch 处理
 * @param {Object} getOpts -- get 请求 fetch 的参数
 * @param {String} getOpts.url -- 接口地址
 * @param {String|Object} getOpts.params -- 请求参数
 * @example
 * getFetch({ url: 'testUrl' })
 *  .then((r) => { ... })
 *  .catch((e) => toggleToast(e.message))
 */
export const getFetch = (getOpts) => {
  const { url, params } = getOpts
  const getUrl = `${url}${params ? `?${objectToUrlencode(params)}` : ''}`
  return fetch(getUrl, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  }).then((response) => getResponse(response))
}

/**
 * post 请求，then 中无需判断业务是否成功，业务失败请去 catch 处理
 * @param {Object} postOpts -- post 请求 fetch 的参数
 * @param {String} postOpts.url -- 接口地址
 * @param {String|Object} postOpts.body -- post 请求需要传的 body
 * @param {String} postOpts.customHeaders -- 其他请求头，可选
 * @example
 * postFetch({ url: 'testUrl' })
 *  .then((r) => { ... })
 *  .catch((e) => toggleToast(e.message))
 */
export const postFetch = (postOpts) => {
  const { url, body, customHeaders } = postOpts
  const headers = { ...customHeaders }
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers,
    body,
  }).then((response) => getResponse(response))
}
