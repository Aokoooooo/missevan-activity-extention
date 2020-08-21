import React, { useState, useContext } from 'react'
import classNames from 'classnames'
import { DevPannelCtx } from '.'

export const EventPannel = () => {
  const { events, sendMessage } = useContext(DevPannelCtx)
  const [type, setType] = useState('')
  const [data, setData] = useState('')
  const [typeError, setTypeError] = useState(false)
  const [dataError, setDataError] = useState(false)

  const onTypeChange = (e) => {
    setTypeError(false)
    setType(e.target.value.trim())
  }
  const onDataChange = (e) => {
    setDataError(false)
    setData(e.target.value.trim())
  }
  const onSubmit = () => {
    if (typeError || dataError) {
      return
    }
    if (!type) {
      setTypeError(true)
      return
    }
    if (data !== '' && !/^\[.*\]$/.test(data)) {
      setDataError(true)
      return
    }
    try {
      // 检查 JSON 格式
      JSON.parse(data || '[]')
      const code = `window.MissEvanEvents.bus.emit('${type}', ...${
        data || '[]'
      })`
      chrome.devtools.inspectedWindow.eval(code, (r, e) => {
        if (e) {
          sendMessage(e)
        }
      })
    } catch (e) {
      setDataError(true)
      sendMessage(e.message)
    }
  }
  const onEnter = (e) => {
    if (e.key === 'Enter') {
      onSubmit()
    }
  }

  return (
    <div className="event-pannel">
      <div className="title">EVENT INFO</div>
      <div className="event-container">
        <div className="header">
          <div className="type">类型</div>
          <div className="data">参数</div>
        </div>
        <div className="content">
          {events.map((v, k) => (
            <div key={k}>
              <div className="type">{v.type}</div>
              <div className="data">{JSON.stringify(v.data)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="event-emiter">
        <input
          className={classNames('type-inputer', { error: typeError })}
          placeholder={`${typeError ? '类型不可为空' : '填写事件的类型'}`}
          onChange={onTypeChange}
          onKeyPress={onEnter}
        />
        <input
          className={classNames('value-inputer', { error: dataError })}
          placeholder={`${
            dataError
              ? '数据须符合 JSON 格式'
              : '填写 JSON 格式的数据，不为空时必须为数组形式'
          }`}
          onChange={onDataChange}
          onKeyPress={onEnter}
        />
        <button className="submit-btn" onClick={onSubmit}>
          发送
        </button>
      </div>
    </div>
  )
}
