import React from 'react'

export const ErrorPage = ({ init }) => {
  return (
    <div className="error-page">
      <div className="title">似乎没有检测到 MissEvanEvents 对象，再试试？</div>
      <button onClick={init}>刷新</button>
    </div>
  )
}
