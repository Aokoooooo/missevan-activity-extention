import React, { useState, useContext } from 'react'
import { LeftPannel } from './left-pannel'
import { DevPannelCtx } from '..'

export const SettingBar = ({ setEvents }) => {
  const { dev } = useContext(DevPannelCtx)
  const [leftPannelShow, setLeftPannelShow] = useState(false)

  const onClearEventsClick = () => {
    setEvents([])
  }
  const onReloadClick = () => {
    window.location.reload()
  }

  return (
    <div className="setting-bar">
      {/* 初始化配置面板 */}
      <LeftPannel
        leftPannelShow={leftPannelShow}
        setLeftPannelShow={setLeftPannelShow}
      />
      {/* setting bar buttons */}
      <button className="init-btn" onClick={() => setLeftPannelShow(true)}>
        初始化
      </button>
      <button onClick={onClearEventsClick}>清空事件</button>
      {dev && <button onClick={onReloadClick}>重载</button>}
    </div>
  )
}
