import React, { useEffect, useState, useRef, createContext } from 'react'
import ReactDom from 'react-dom'
import './index.scss'
import { DataPannel } from './data-pannel'
import { EventPannel } from './event-pannel'
import { MESSAGE_SOURCE, MESSAGE_DATA_TYPE } from '../utils/constants'
import { SettingBar } from './setting-bar'

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
  const baseInfo = useRef()
  const [data, setData] = useState({})
  const [events, setEvents] = useState([])

  const sendMessage = (payload) => {
    baseInfo.current.port.postMessage({
      source: MESSAGE_SOURCE.DEVTOOLS,
      payload,
    })
  }
  const toast = (msg) => {
    const div = document.createElement('div')
    APP.appendChild(div)
    ReactDom.render(<Toast msg={msg} />, div)
    setTimeout(() => {
      ReactDom.unmountComponentAtNode(div)
      APP.removeChild(div)
    }, 2000)
  }
  const evalCode = (code, onSuccess, onErr) => {
    chrome.devtools.inspectedWindow.eval(code, (r, e) => {
      if (r && onSuccess) {
        onSuccess(r)
      }
      if (e) {
        sendMessage(e)
        toast(JSON.stringify(e))
        if (onErr) {
          onErr(e)
        }
      }
    })
  }

  useEffect(() => {
    const { tabId } = chrome.devtools.inspectedWindow
    const port = chrome.runtime.connect({
      name: `${MESSAGE_SOURCE.DEVTOOLS}-${tabId || ''}`,
    })
    port.onMessage.addListener((message) => {
      if (message.type === MESSAGE_DATA_TYPE.EVENT) {
        setEvents([...events, message.payload])
      } else if (message.type === MESSAGE_DATA_TYPE.DATA) {
        setData(message.payload)
      }
    })
    baseInfo.current = { port, tabId }
  })

  useEffect(() => {
    evalCode('window.MissEvanEvents.getValue()', setData)
  }, [])
  return (
    <DevPannelCtx.Provider
      value={{
        data,
        events,
        sendMessage,
        toast,
        evalCode,
      }}
    >
      <div className="dev-pannel">
        <div className="pannel-container">
          <DataPannel />
          <EventPannel />
        </div>
        <SettingBar />
      </div>
    </DevPannelCtx.Provider>
  )
}

ReactDom.render(<DevPannel />, APP)
