import React, { useState, useContext } from 'react'
import classNames from 'classnames'
import { DevPannelCtx } from '..'
import { EMIT_EVENT } from '../utils/actions'
import { toast } from '../toast'

export const EventPannel = ({ className }) => {
  const { events, evalCode } = useContext(DevPannelCtx)
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
    if (typeError || !type) {
      toast('类型不可为空')
      setTypeError(true)
      return
    }
    // 数据不为空时必须为数组
    if (dataError || (data !== '' && !/^\[.*\]$/.test(data))) {
      setDataError(true)
      toast('参数要求为 JSON 数组')
      return
    }
    try {
      // 检测 JSON 格式
      JSON.parse(data || '[]')
    } catch (e) {
      setDataError(true)
      toast('参数要求为 JSON 数组')
      return
    }
    // 在页面中执行 emit
    evalCode(EMIT_EVENT(type, data))
  }
  const onEnter = (e) => {
    if (e.key === 'Enter') {
      onSubmit()
    }
  }

  return (
    <div className={classNames('event-pannel', className)}>
      <div className="title">EVENT INFO</div>
      <div className="event-container">
        <div className="header">
          <div className="type">类型</div>
          <div className="data">参数</div>
        </div>
        {/* 事件消息队列 */}
        <div className="content">
          {events.map((v, k) => (
            <div key={k}>
              <div className="type">{v.type}</div>
              <div className="data">{JSON.stringify(v.data)}</div>
            </div>
          ))}
        </div>
      </div>
      {/* 事件发送表单 */}
      <div className="event-emiter">
        <input
          className={classNames('type-inputer', { error: typeError })}
          placeholder={`${typeError ? '类型不可为空' : '填写事件的类型'}`}
          onChange={onTypeChange}
          onKeyPress={onEnter}
        />
        <input
          className={classNames('value-inputer', { error: dataError })}
          placeholder="数据不为空时要求为 JSON 数组"
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
