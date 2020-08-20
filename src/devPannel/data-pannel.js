import React, { useState, useContext } from 'react'
import classNames from 'classnames'
import { PannelHeader } from './pannel-header'
import { DevPannelCtx } from '.'

export const DataPannel = () => {
  const {
    data,
    onDataPannelHeaderIconClick,
    dataPannelClosed,
  } = useContext(DevPannelCtx)
  return (
    <div className={classNames('data-pannel', { closed: dataPannelClosed })}>
      <PannelHeader
        title="DATA INFO"
        onIconClick={onDataPannelHeaderIconClick}
        closed={dataPannelClosed}
      />
      <div className="content"></div>
    </div>
  )
}
