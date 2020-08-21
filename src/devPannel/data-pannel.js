import React, { useState, useContext } from 'react'
import classNames from 'classnames'
import { DevPannelCtx } from '.'

export const DataPannel = () => {
  const { data } = useContext(DevPannelCtx)
  return (
    <div className="data-pannel">
      <div className="title">DATA INFO</div>
      <div className="content"></div>
    </div>
  )
}
