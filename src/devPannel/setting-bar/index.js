import React, { useState } from 'react'
import { LeftPannel } from './left-pannel'

export const SettingBar = ({ setEvents }) => {
  const [leftPannelShow, setLeftPannelShow] = useState(false)

  const onClearEventsClick = () => {
    setEvents([])
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
    </div>
  )
}
