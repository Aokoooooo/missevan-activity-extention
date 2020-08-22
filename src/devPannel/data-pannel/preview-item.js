import React, { useState, useMemo } from 'react'
import classNames from 'classnames'


export const PreviewItem = ({ itemKey, children, isObj, isArr, count }) => {
  const [open, setOpen] = useState(false)
  const isObject = isObj || isArr
  const childrenLength = children.props.children.length
  const hideArrow = !isObject || (isObject && !childrenLength)
  const renderedObjAbbreviation = useMemo(() => {
    if (!isObject) {
      return null
    }
    return isArr ? `Array(${childrenLength})` : 'Object'
  }, [isArr, isObj])
  const renderedChildren = useMemo(() => {
    // 非数组和对象直接显示
    if (!isObject) {
      return children
    }
    // 数组和对象折叠时显示缩写
    if (!open) {
      return renderedObjAbbreviation
    }
    // 展示数组和对象
    return children
  }, [renderedObjAbbreviation, open, children])

  const onClick = (e) => {
    e.stopPropagation()
    if (hideArrow) {
      return
    }
    setOpen(!open)
  }

  return (
    <div
      className={classNames('item', {
        open: isObject && open,
        clickable: !hideArrow,
      })}
      style={{ marginLeft: count * 10 }}
      onClick={onClick}
    >
      <div className="left">
        <div className={classNames('arrow', { hide: hideArrow, open })} />
        <div className="key">{itemKey}:&nbsp;</div>
      </div>
      {renderedChildren}
    </div>
  )
}
