import React, { useState } from 'react'
import classNames from 'classnames'

export const SettingBar = () => {
  const [leftPannelShow, setLeftPannelShow] = useState(false)

  return (
    <div className="setting-bar">
      <div className={classNames('left-pannel', { show: leftPannelShow })}>
        <div className="header">
          <div />
          <div className="title">初始化环境</div>
          <div className="close-btn" onClick={() => setLeftPannelShow(false)}>
            x
          </div>
        </div>
        <div className="input-item">
          <div className="label">活动 ID</div>
          <input />
        </div>
        <div className="input-item">
          <div className="label">PC 环境</div>
          <input />
        </div>
        <div className="input-item">
          <div className="label">UAT 环境</div>
          <input />
        </div>
        <div className="input-item">
          <div className="label">需要加特林</div>
          <input />
        </div>
        <button>确认</button>
      </div>
      <button className="init-btn" onClick={() => setLeftPannelShow(true)}>
        初始化
      </button>
    </div>
  )
}
