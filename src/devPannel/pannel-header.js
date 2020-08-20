import React from 'react'
import classNames from 'classnames'

const PannelHeaderIcon = ({ onIconClick, left, closed }) => {
  return (
    <i
      className={classNames('hide-pannel-icon', {
        closed,
        right: !left,
        left,
      })}
      onClick={onIconClick}
    >
      {left ? '>' : '<'}
    </i>
  )
}

export const PannelHeader = ({ title, isLeft, onIconClick, closed }) => {
  return (
    <div className="title">
      {isLeft ? (
        <PannelHeaderIcon
          onIconClick={onIconClick}
          left={true}
          closed={closed}
        />
      ) : (
        <i />
      )}
      <span>{title}</span>
      {!isLeft ? (
        <PannelHeaderIcon onIconClick={onIconClick} closed={closed} />
      ) : (
        <i />
      )}
    </div>
  )
}
