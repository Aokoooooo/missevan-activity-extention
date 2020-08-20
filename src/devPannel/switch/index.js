import React, { useState, useEffect } from 'react'
import classNames from 'classnames'

export const Switch = ({ label, onChange, value }) => {
  const [isSelected, setIsSelected] = useState(false)

  const onClick = () => {
    setIsSelected(!isSelected)
    if (typeof onChange === 'function') {
      onChange(!isSelected)
    }
  }

  useEffect(() => {
    setIsSelected(value)
  }, [value])

  return (
    <div className="switch">
      <div className="label">{label}</div>
      <div
        className={classNames('switch-item', { active: isSelected })}
        onClick={onClick}
      >
        <div className={classNames('switch-ball', { active: isSelected })} />
      </div>
    </div>
  )
}
