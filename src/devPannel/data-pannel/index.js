import React, { useState, useContext, useMemo } from 'react'
import classNames from 'classnames'
import { DevPannelCtx } from '..'

const PreviewItem = ({ itemKey, children, isObj, isArr, isEmpty, count }) => {
  const [open, setOpen] = useState(false)
  const isObject = isObj || isArr
  const hideArrow = !isObject || (isObject && isEmpty)
  const renderedObjAbbreviation = useMemo(() => {
    return isArr ? (isEmpty ? '[ ]' : '[ ... ]') : isEmpty ? '{ }' : '{ ... }'
  }, [isArr, isEmpty])
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
      className={classNames('item', { open: isObject && open, clickable: !hideArrow })}
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

export const DataPannel = () => {
  const { data } = useContext(DevPannelCtx)
  const [isPreview, setIsPreview] = useState(true)

  // 遍历渲染 store 数据
  const renderPreview = (obj, count) => {
    return Object.keys(obj).map((v, k) => {
      const itemValue = obj[v]
      if (itemValue === null || itemValue === undefined) {
        return (
          <PreviewItem itemKey={v} key={k} count={count}>
            <div className="grey">{`${itemValue}`}</div>
          </PreviewItem>
        )
      }
      if (typeof itemValue === 'number' || typeof itemValue === 'boolean') {
        return (
          <PreviewItem itemKey={v} key={k} count={count}>
            <div className="blue">{`${itemValue}`}</div>
          </PreviewItem>
        )
      }
      if (typeof itemValue === 'string') {
        return (
          <PreviewItem itemKey={v} key={k} count={count}>
            <div className="red">{`"${itemValue}"`}</div>
          </PreviewItem>
        )
      }
      if (Array.isArray(itemValue)) {
        return (
          <PreviewItem
            itemKey={v}
            key={k}
            isArr={true}
            isObj={false}
            isEmpty={!itemValue.length}
            count={count}
          >
            <div className="arr">{renderPreview(itemValue, count + 1)}</div>
          </PreviewItem>
        )
      }
      if (typeof itemValue === 'object') {
        return (
          <PreviewItem
            itemKey={v}
            key={k}
            isArr={false}
            isObj={true}
            isEmpty={!Object.keys(itemValue).length}
            count={count}
          >
            <div className="obj">{renderPreview(itemValue, count + 1)}</div>
          </PreviewItem>
        )
      }
    })
  }

  const stringifiedData = useMemo(() => {
    return JSON.stringify(data, null, 2)
  }, [data])
  const renderedPreview = useMemo(() => {
    return renderPreview(data, 0)
  }, [data])

  return (
    <div className="data-pannel">
      <div className="title">DATA INFO</div>
      <div className="data-container">
        <div className="header">
          <div className="preview" onClick={() => setIsPreview(true)}>
            预览
          </div>
          <div className="data" onClick={() => setIsPreview(false)}>
            JSON
          </div>
        </div>
        <div className="content">
          {!isPreview ? (
            <div className="json">{stringifiedData}</div>
          ) : (
            <div className="preview">{renderedPreview}</div>
          )}
        </div>
      </div>
    </div>
  )
}
