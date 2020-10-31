import React, { useState, useContext, useEffect } from 'react'
import classNames from 'classnames'
import { Switch } from '../switch'
import { DevPannelCtx } from '..'
import { getFetch, MISSEVAN_URL } from '../utils/api'
import { UPDATE_STORE, UPDATE_JTL_DOM } from '../utils/actions'
import { MISSEVAN_JTL_UPDATE_TYPE } from '../utils/constants'
import { toast } from '../toast'

const PAGE_TYPE = {
  EVENT: 'EVENT',
  TOPIC: 'TOPIC',
}

export const LeftPannel = ({ leftPannelShow, setLeftPannelShow }) => {
  const { data, evalCode, initCounter } = useContext(DevPannelCtx)
  const [isPC, setIsPC] = useState(false)
  const [isUAT, setIsUAT] = useState(false)
  const [pageType, setPageType] = useState()
  const [eventId, setEventId] = useState(0)
  const [topicId, setTopicId] = useState(0)
  const [enableComment, setEnableComment] = useState(false)
  const [needJtl, setNeedJtl] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchEvent = () => {
    if (!eventId) {
      return Promise.resolve()
    }
    // 更新活动信息
    return getFetch({
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
  }
  const fetchTopic = () => {
    if (!topicId) {
      return Promise.resolve()
    }
    // 更新活动信息
    return getFetch({
      url: `${MISSEVAN_URL.API_URL(isUAT)}/mtopic/gettopic?topicid=${topicId}`,
    })
      .then((r) => {
        const shareOpts = {
          title: r.info.title,
          imageUrl: r.info.share_pic_url,
          url: `${MISSEVAN_URL.API_URL(isUAT)}/mtopic/${topicId}`,
        }
        const topicData = JSON.stringify({
          shareOpts,
          info: r.info,
        })
        evalCode(UPDATE_STORE(`{ ...state, topicData: ${topicData} }`))
          .then(() => {
            toast('专题数据更新成功')
          })
          .catch((e) => {})
      })
      .catch((e) => {
        toast(e.message)
        console.error(e)
      })
  }
  const onSubmit = () => {
    if (loading) {
      return
    }
    setLoading(true)
    // 更新基础信息
    const baseInfo = { isPC, isUAT, pageType, eventId, topicId, enableComment }
    evalCode(UPDATE_STORE(JSON.stringify(baseInfo)))
    toast('基础信息更新成功')
    if (!eventId && !topicId) {
      setLoading(false)
      return
    }
    Promise.all([fetchEvent(), fetchTopic()]).finally(() => setLoading(false))
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
  const onEnter = (e) => {
    if (e.key === 'Enter') {
      onSubmit()
    }
  }
  const onJtlClick = () => {
    setNeedJtl(!needJtl)
    // 更新加特林
    const { jsUrl, cssUrl } = MISSEVAN_URL.JTL_URL(isUAT)
    evalCode(
      UPDATE_JTL_DOM(
        needJtl ? MISSEVAN_JTL_UPDATE_TYPE.DEL : MISSEVAN_JTL_UPDATE_TYPE.ADD,
        jsUrl,
        cssUrl
      )
    ).then(() => toast(needJtl ? '移除成功' : '添加成功'))
  }

  useEffect(() => {
    // 自动同步 data 数据
    setEventId(data.eventId || '')
    setIsPC(data.isPC)
    setIsUAT(data.isUAT)
  }, [data])

  // 页面刷新时初始化 jtl 并打开面板
  useEffect(() => {
    setLeftPannelShow(true)
    setNeedJtl(false)
  }, [initCounter])

  return (
    <div className={classNames('left-pannel', { show: leftPannelShow })}>
      <div className="header">
        <div />
        <div className="title">初始化环境</div>
        <div className="close-btn" onClick={() => setLeftPannelShow(false)}>
          x
        </div>
      </div>
      <div className="content">
        <Switch label="PC 环境" onChange={setIsPC} value={isPC} />
        <Switch label="UAT 环境" onChange={setIsUAT} value={isUAT} />
        <div className="input-item">
          <div className="label">页面类型</div>
          <select
            value={pageType}
            onChange={(e) => setPageType(e.target.value)}
          >
            <option
              selected="selected"
              disabled="disabled"
              style={{ display: 'none' }}
              value=""
            />
            <option value={PAGE_TYPE.EVENT}>{PAGE_TYPE.EVENT}</option>
            <option value={PAGE_TYPE.TOPIC}>{PAGE_TYPE.TOPIC}</option>
          </select>
        </div>
        {pageType === PAGE_TYPE.EVENT && (
          <div className="input-item">
            <div className="label">活动 ID</div>
            <input
              value={eventId}
              onChange={(e) => setEventId(Number(e.target.value))}
              onKeyPress={onEnter}
            />
          </div>
        )}
        {pageType === PAGE_TYPE.TOPIC && (
          <>
            <div className="input-item">
              <div className="label">专题 ID</div>
              <input
                value={topicId}
                onChange={(e) => setTopicId(Number(e.target.value))}
                onKeyPress={onEnter}
              />
            </div>
            <Switch
              label="启用评论"
              onChange={setEnableComment}
              value={enableComment}
            />
          </>
        )}
        <button onClick={onSubmit}>{loading ? '...' : '确认'}</button>
        <div className="divider">下方按钮的行为取决于当前 UAT 状态</div>
        <div className="other-btns">
          <button onClick={onUpdateUserInfo}>同步用户信息</button>
          <button onClick={onJtlClick}>
            {needJtl ? '移除加特林' : '引入加特林'}
          </button>
        </div>
      </div>
    </div>
  )
}
