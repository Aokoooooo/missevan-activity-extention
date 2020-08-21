import React, { useEffect, useState, useRef, createContext } from 'react'
import ReactDom from 'react-dom'
import './index.scss'
import { DataPannel } from './data-pannel'
import { EventPannel } from './event-pannel'
import { MESSAGE_SOURCE, MESSAGE_DATA_TYPE } from '../utils/constants'
import { SettingBar } from './setting-bar'

export const DevPannelCtx = createContext({})

const DevPannel = () => {
  const baseInfo = useRef()
  const [data, setData] = useState([])
  const [events, setEvents] = useState([])

  const sendMessage = (payload) => {
    baseInfo.current.port.postMessage({
      source: MESSAGE_SOURCE.DEVTOOLS,
      payload,
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

  return (
    <DevPannelCtx.Provider
      value={{
        data,
        events,
        sendMessage,
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

ReactDom.render(<DevPannel />, document.getElementById('app'))
