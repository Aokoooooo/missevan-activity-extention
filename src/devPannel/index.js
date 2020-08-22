import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useCallback,
} from 'react'
import ReactDom from 'react-dom'
import './index.scss'
import { DataPannel } from './data-pannel'
import { EventPannel } from './event-pannel'
import { MESSAGE_SOURCE, MESSAGE_DATA_TYPE } from './utils/constants'
import { SettingBar } from './setting-bar'
import { ErrorPage } from './error-page'
import { GET_STORE_VALUE } from './utils/actions'

const Toast = ({ msg }) => {
  return (
    <div className="toast">
      <div className="msg">{msg}</div>
    </div>
  )
}

export const DevPannelCtx = createContext({})
const APP = document.getElementById('app')
const DevPannel = () => {
  const [data, setData] = useState({})
  const [events, setEvents] = useState([])
  const [initError, setInitError] = useState(false)
  const appendEvents = useCallback(
    (newEvent) => {
      setEvents([...events, newEvent])
    },
    [events, setEvents]
  )
  const appendEventsRef = useRef(appendEvents)

  // 弹出toast
  const toast = (msg) => {
    const div = document.createElement('div')
    APP.appendChild(div)
    ReactDom.render(<Toast msg={msg} />, div)
    setTimeout(() => {
      ReactDom.unmountComponentAtNode(div)
      APP.removeChild(div)
    }, 2000)
  }
  // 在页面中执行代码
  const evalCode = (code, hideToast) => {
    return new Promise((resolve, reject) => {
      chrome.devtools.inspectedWindow.eval(code, (r, e) => {
        if (e) {
          if (!hideToast) {
            toast(JSON.stringify(e))
          }
          console.error(e)
          reject(e)
          return
        }
        resolve(r)
      })
    })
  }
  const init = () => {
    evalCode(GET_STORE_VALUE, true)
      .then((r) => {
        setData(r)
        setInitError(false)
      })
      .catch(() => {
        setInitError(true)
      })
  }

  // 初始化
  useEffect(() => {
    // 缓存当前标签页 ID
    const { tabId } = chrome.devtools.inspectedWindow
    // 和 background 建立连接
    const port = chrome.runtime.connect({
      name: `${MESSAGE_SOURCE.DEVTOOLS}-${tabId || ''}`,
    })
    // 监听 background 消息
    port.onMessage.addListener((message) => {
      switch (message.type) {
        case MESSAGE_DATA_TYPE.EVENT: {
          appendEventsRef.current(message.payload)
          return
        }
        case MESSAGE_DATA_TYPE.DATA: {
          setData(message.payload)
          return
        }
        case MESSAGE_DATA_TYPE.INIT_ERROR: {
          setInitError(true)
          return
        }
        case MESSAGE_DATA_TYPE.INIT: {
          setInitError(false)
          return
        }
      }
    })
    // 同步 store 数据
    init()
  }, [])
  // 更新 setEvents 函数
  useEffect(() => {
    appendEventsRef.current = appendEvents
  }, [appendEvents])

  return (
    <DevPannelCtx.Provider
      value={{
        data,
        events,
        toast,
        evalCode,
      }}
    >
      <div className="dev-pannel">
        {initError ? (
          <ErrorPage init={init} />
        ) : (
          <>
            <div className="pannel-container">
              <DataPannel />
              <EventPannel />
            </div>
            <SettingBar setEvents={setEvents} />
          </>
        )}
      </div>
    </DevPannelCtx.Provider>
  )
}

ReactDom.render(<DevPannel />, APP)
