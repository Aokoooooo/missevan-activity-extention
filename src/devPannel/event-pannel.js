import React, { useState, useContext } from 'react'
import classNames from 'classnames'
import { PannelHeader } from './pannel-header'
import { DevPannelCtx } from '.'

export const EventPannel = () => {
  const {
    events,
    onEventPannelHeaderIconClick,
    eventPannelClosed,
  } = useContext(DevPannelCtx)
  return (
    <div className={classNames('event-pannel', { closed: eventPannelClosed })}>
      <PannelHeader
        title="EVENT INFO"
        isLeft={true}
        onIconClick={onEventPannelHeaderIconClick}
        closed={eventPannelClosed}
      />
      <table>
        <thead>
          <th>类型</th>
          <th>参数</th>
        </thead>
        <tbody>
          {events.map((v, k) => (
            <tr className="event-item" key={k}>
              <td className="event-item-title">{v.type}</td>
              <td className="event-item-value">{v.data}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
