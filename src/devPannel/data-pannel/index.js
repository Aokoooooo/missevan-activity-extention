import React, { useState, useContext, useMemo, useEffect, useRef } from 'react'
import ClipboardJS from 'clipboard'
import { DevPannelCtx } from '..'
import { PreviewItem } from './preview-item'

export const DataPannel = () => {
  const { data } = useContext(DevPannelCtx)
  const [isPreview, setIsPreview] = useState(true)
  const clipboardRef = useRef()

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

  useEffect(() => {
    clipboardRef.current = new ClipboardJS('.copy-btn')
    return clipboardRef.current.destroy
  }, [])

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
          {isPreview ? (
            <div className="preview">{renderedPreview}</div>
          ) : (
            <>
              <div className="json" id="stringifiedData">
                {stringifiedData}
              </div>
              <button
                className="copy-btn"
                data-clipboard-target="#stringifiedData"
              >
                复制
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
