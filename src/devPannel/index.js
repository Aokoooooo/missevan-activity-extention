import React, { useEffect, useState, useRef, createContext } from 'react'
import ReactDom from 'react-dom'
import './index.scss'
import { DataPannel } from './data-pannel'
import { EventPannel } from './event-pannel'
import { MESSAGE_SOURCE, MESSAGE_DATA_TYPE } from '../utils/constants'

export const DevPannelCtx = createContext({})

const DevPannel = () => {
  const baseInfo = useRef()
  const [data, setData] = useState([])
  const [events, setEvents] = useState([])
  const [dataPannelClosed, setDataPannelClosed] = useState(false)
  const [eventPannelClosed, setEventPannelClosed] = useState(false)

  const checkPannelStatus = (otherPannel, thisPannel) =>
    !(otherPannel && !thisPannel)
  const onDataPannelHeaderIconClick = () => {
    if (checkPannelStatus(eventPannelClosed, dataPannelClosed)) {
      setDataPannelClosed(!dataPannelClosed)
    }
  }
  const onEventPannelHeaderIconClick = () => {
    if (checkPannelStatus(dataPannelClosed, eventPannelClosed)) {
      setEventPannelClosed(!eventPannelClosed)
    }
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
        dataPannelClosed,
        eventPannelClosed,
        onDataPannelHeaderIconClick,
        onEventPannelHeaderIconClick,
      }}
    >
      <div className="dev-pannel">
        <DataPannel />
        <EventPannel />
      </div>
    </DevPannelCtx.Provider>
  )
}

ReactDom.render(<DevPannel />, document.getElementById('app'))
