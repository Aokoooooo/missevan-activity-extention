import React, { useState } from 'react'
import classNames from 'classnames'
import { LeftPannel } from './left-pannel'

export const SettingBar = () => {
  const [leftPannelShow, setLeftPannelShow] = useState(false)

  return (
    <div className="setting-bar">
      {/* 初始化配置面板 */}
      <LeftPannel leftPannelShow={leftPannelShow} setLeftPannelShow={setLeftPannelShow} />
      {/* setting bar buttons */}
      <button className="init-btn" onClick={() => setLeftPannelShow(true)}>
        初始化
      </button>
    </div>
  )
}
