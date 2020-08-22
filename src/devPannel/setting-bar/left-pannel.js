import React, { useState, useContext, useEffect } from 'react'
import classNames from 'classnames'
import { Switch } from '../switch'
import { DevPannelCtx } from '..'
import { getFetch, MISSEVAN_URL } from '../utils/api'
import { UPDATE_STORE, UPDATE_JTL_DOM } from '../utils/actions'
import { MISSEVAN_JTL_UPDATE_TYPE } from '../utils/constants'

export const LeftPannel = ({ leftPannelShow, setLeftPannelShow }) => {
  const { data, evalCode, toast } = useContext(DevPannelCtx)
  const [eventId, setEventId] = useState('')
  const [isPC, setIsPC] = useState(false)
  const [isUAT, setIsUAT] = useState(false)
  const [needJtl, setNeedJtl] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = () => {
    if (loading) {
      return
    }
    setLoading(true)
    // 更新加特林
    const { jsUrl, cssUrl } = MISSEVAN_URL.JTL_URL(isUAT)
    evalCode(
      UPDATE_JTL_DOM(
        needJtl ? MISSEVAN_JTL_UPDATE_TYPE.ADD : MISSEVAN_JTL_UPDATE_TYPE.DEL,
        jsUrl,
        cssUrl
      )
    )
    // 更新基础信息
    const baseInfo = { eventId, isPC, isUAT }
    evalCode(UPDATE_STORE(JSON.stringify(baseInfo)))
    toast('基础信息更新成功')
    if (!eventId) {
      setLoading(false)
      return
    }
    // 更新活动信息
    getFetch({
      url: `${MISSEVAN_URL.API_URL(isUAT)}/mobileWeb/getevent?id=${eventId}`,
    })
      .then((r) => {
        const shareOpts = {
          title: r.info.title,
          imageUrl: r.info.cover,
          description: r.info.short_intro,
          url: `${MISSEVAN_URL.API_URL(isUAT)}/mevent/${eventId}`,
        }
        const eventData = JSON.stringify({
          isEnd: r.info.end_time * 1000 < Date.now(),
          isStart: r.info.create_time * 1000 < Date.now(),
          shareOpts,
          info: r.info,
        })
        evalCode(UPDATE_STORE(`{ ...state, eventData: ${eventData} }`))
          .then(() => {
            toast('活动数据更新成功')
          })
          .catch((e) => {})
      })
      .catch((e) => {
        toast(e.message)
        console.error(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const onUpdateUserInfo = () => {
    getFetch({
      url: `${MISSEVAN_URL.API_URL(isUAT)}/account/userinfo`,
    })
      .then((r) => {
        evalCode(
          UPDATE_STORE(`{ ...state, userInfo: ${JSON.stringify(r.info)}}`)
        ).then(() => {
          toast('用户信息更新成功')
        })
      })
      .catch((e) => {
        toast(e.message)
      })
  }

  useEffect(() => {
    // 自动同步 data 数据
    setEventId(data.eventId || '')
    setIsPC(data.isPC)
    setIsUAT(data.isUAT)
  }, [data])

  return (
    <div className={classNames('left-pannel', { show: leftPannelShow })}>
      <div className="header">
        <div />
        <div className="title">初始化环境</div>
        <div className="close-btn" onClick={() => setLeftPannelShow(false)}>
          x
        </div>
      </div>
      <div className="input-item">
        <div className="label">活动 ID</div>
        <input value={eventId} onChange={(e) => setEventId(e.target.value)} />
      </div>
      <Switch label="PC 环境" onChange={setIsPC} value={isPC} />
      <Switch label="UAT 环境" onChange={setIsUAT} value={isUAT} />
      <Switch label="需要加特林" onChange={setNeedJtl} />
      <button onClick={onSubmit}>{loading ? '...' : '确认'}</button>
      <div className="divider" />
      <div className="other-btns">
        <button onClick={onUpdateUserInfo}>同步用户信息</button>
      </div>
    </div>
  )
}
